import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { Avatar, Spinner } from '@/components/ui';
import { toast } from 'react-hot-toast';

export default function CommunityPage() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState({});
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [uRes, rRes] = await Promise.all([
        api.get('/social/community'),
        api.get('/social/friend-requests'),
      ]);
      setUsers(uRes.data.users || []);
      setRequests(rRes.data.requests || []);
    } catch {
      toast.error('Failed to load community data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddFriend = async (userId) => {
    try {
      setRequesting(prev => ({ ...prev, [userId]: true }));
      const response = await api.post(`/social/friend-request/${userId}`);
      if (response.data.message === "Friend added instantly!") {
        toast.success('Friend added!');
      } else {
        toast.success('Friend request sent!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setRequesting(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleAccept = async (reqId) => {
    try {
      await api.post(`/social/friend-accept/${reqId}`);
      toast.success('Request accepted!');
      fetchData();
    } catch {
      toast.error('Failed to accept request');
    }
  };

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-32"><Spinner className="text-slate-400" size={24} /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-24 pt-10 px-6 space-y-12">

      {/* ── HEADER ── */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Icons.Users size={20} className="text-blue-600" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Network</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">SkillForge Community</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Connect with developers worldwide.</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-2xl font-black text-slate-900">{users.length}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Top Active</div>
          </div>
        </div>
      </div>

      {/* ── INCOMING REQUESTS ── */}
      {requests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Pending Connections ({requests.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map(req => (
              <div key={req.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <Avatar user={req.sender} size={36} className="rounded-full flex-shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm truncate">{req.sender.username}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{(req.sender.xp || 0).toLocaleString()} XP</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAccept(req.id)} className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Icons.Check size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-200 hover:text-slate-600 transition-colors">
                    <Icons.X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SEARCH & LISTING ── */}
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Icons.Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by username..."
            className="w-full bg-white border border-slate-200 rounded-lg py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(u => (
            <div key={u.id} className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all flex flex-col shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar user={u} size={48} className="rounded-full bg-slate-100" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-[15px] truncate">{u.username}</h3>
                    <p className="text-[11px] text-slate-500 font-mono tracking-wide mt-0.5">Lvl {Math.floor((u.xp || 0) / 1000) + 1} Eng</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/u/${u.username}`)}
                  className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <Icons.ArrowRight size={14} className="-rotate-45" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6 px-1">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Global XP</div>
                  <div className="font-mono text-sm text-slate-900">{(u.xp || 0).toLocaleString()}</div>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Badges</div>
                  <div className="font-mono text-sm text-slate-900">{u._count?.badges || 0}</div>
                </div>
              </div>

              <button
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 mt-auto uppercase tracking-widest ${
                  requesting[u.id]
                    ? 'bg-slate-100 text-slate-400 cursor-wait'
                    : 'bg-slate-900 hover:bg-blue-600 text-white shadow-sm'
                }`}
                onClick={() => handleAddFriend(u.id)}
                disabled={!!requesting[u.id]}
              >
                {requesting[u.id] ? (
                  <><Spinner className="w-3 h-3" /> Sending...</>
                ) : (
                  <><Icons.UserPlus size={14} /> Connect</>
                )}
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <Icons.Users size={32} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-900 font-bold">No developers found</p>
            <p className="text-slate-500 text-sm mt-1">Try refining your search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}

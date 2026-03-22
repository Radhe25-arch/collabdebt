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
      await api.post(`/social/friend-request/${userId}`);
      toast.success('Friend request sent!');
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

  if (loading) return <div className="flex justify-center p-20"><Spinner /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 pt-8 px-4 space-y-10 font-sans animate-fade-in">

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
            Community
          </span>
          <h1 className="font-display font-black text-3xl text-slate-900 mt-3 mb-1">
            Find developers to follow
          </h1>
          <p className="text-slate-500 text-sm max-w-md leading-relaxed">
            Connect with other learners, track their progress, and build your developer network.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-2.5 text-center shadow-sm">
            <div className="text-xl font-black text-slate-900">{users.length}</div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Active</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-2.5 text-center shadow-sm">
            <div className="flex items-center gap-1.5 justify-center">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-bold text-green-600">Online</span>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Status</div>
          </div>
        </div>
      </div>

      {/* ── INCOMING REQUESTS ── */}
      {requests.length > 0 && (
        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Icons.UserPlus size={17} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-display font-bold text-slate-900 text-base">Friend Requests</h2>
              <p className="text-xs text-slate-400">{requests.length} pending</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map(req => (
              <div key={req.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Avatar user={req.sender} size={44} className="rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{req.sender.username}</p>
                  <p className="text-xs text-slate-400">{(req.sender.xp || 0).toLocaleString()} XP</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <Icons.Check size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-300 transition-colors">
                    <Icons.X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SEARCH ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Icons.Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or username..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>
        <span className="text-sm text-slate-400 font-medium">{filtered.length} developers</span>
      </div>

      {/* ── DEVELOPER GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(u => (
          <div
            key={u.id}
            className="group bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col"
          >
            {/* Top: avatar + name */}
            <div className="flex items-center gap-4 mb-5">
              <div className="relative flex-shrink-0">
                <Avatar user={u} size={52} className="rounded-2xl ring-2 ring-slate-100 group-hover:ring-blue-100 transition-all" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${u.xp > 5000 ? 'bg-amber-400' : 'bg-slate-300'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-slate-900 text-base truncate group-hover:text-blue-600 transition-colors">
                  {u.username}
                </h3>
                <p className="text-xs text-slate-400 capitalize">{u.role?.toLowerCase() || 'Student'}</p>
              </div>
              <button
                onClick={() => navigate(`/u/${u.username}`)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all flex-shrink-0"
              >
                <Icons.User size={14} />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">XP Total</div>
                <div className="font-bold text-slate-900 text-base">{(u.xp || 0).toLocaleString()}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Badges</div>
                <div className="font-bold text-slate-900 text-base">{u._count?.badges || 0}</div>
              </div>
            </div>

            {/* Level bar */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-slate-400 font-medium">Level {Math.floor((u.xp || 0) / 1000) + 1}</span>
                <span className="text-xs text-slate-400">{((u.xp || 0) % 1000)}/1000 XP</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${((u.xp || 0) % 1000) / 10}%` }}
                />
              </div>
            </div>

            {/* CTA */}
            <button
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 mt-auto ${
                requesting[u.id]
                  ? 'bg-blue-100 text-blue-400 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-blue-200'
              }`}
              onClick={() => handleAddFriend(u.id)}
              disabled={!!requesting[u.id]}
            >
              {requesting[u.id] ? (
                <><Spinner className="w-3 h-3" /> Sending...</>
              ) : (
                <><Icons.UserPlus size={14} /> Add Friend</>
              )}
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Icons.Users size={24} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">No developers found.</p>
          <p className="text-slate-400 text-sm mt-1">Try a different search term.</p>
        </div>
      )}
    </div>
  );
}

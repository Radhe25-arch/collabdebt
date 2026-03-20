import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { Avatar, Button, Spinner } from '@/components/ui';

import { toast } from 'react-hot-toast';

export default function CommunityPage() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState({});
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [uRes, rRes] = await Promise.all([
        api.get('/social/community'),
        api.get('/social/friend-requests')
      ]);
      setUsers(uRes.data.users || []);
      setRequests(rRes.data.requests || []);
    } catch (err) {
      toast.error("Failed to load community data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddFriend = async (userId) => {
    try {
      setRequesting(prev => ({ ...prev, [userId]: true }));
      await api.post(`/social/friend-request/${userId}`);
      toast.success("Friend request sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setRequesting(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleAccept = async (reqId) => {
    try {
      await api.post(`/social/friend-accept/${reqId}`);
      toast.success("Request accepted!");
      fetchData();
    } catch (err) {
      toast.error("Failed to accept request");
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Spinner /></div>;

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl text-slate-900 tracking-tight">Community</h1>
          <p className="text-slate-500 mt-1">Connect with other developers and track their progress.</p>
        </div>
      </div>

      {/* Pending Requests Section */}
      {requests.length > 0 && (
        <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Icons.UserPlus size={20} className="text-blue-600" />
            <h2 className="font-display font-bold text-xl text-slate-900">Pending Requests</h2>
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">{requests.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map(req => (
              <div key={req.id} className="bg-white border border-blue-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                <Avatar user={req.sender} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate text-sm">{req.sender.username}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{req.sender.xp.toLocaleString()} XP</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleAccept(req.id)}
                    className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Icons.Check size={16} />
                  </button>
                  <button className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <Icons.X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discover People */}
      <div>
        <h2 className="font-display font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
          Discover People
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(u => (
          <div key={u.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <Avatar user={u} size={48} />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 truncate">{u.username}</h3>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{u.role || 'DEVELOPER'}</p>
              </div>
              <button 
                onClick={() => navigate(`/u/${u.username}`)}
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                <Icons.ChevronRight size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Experience</p>
                <p className="font-display font-bold text-slate-900">{(u.xp || 0).toLocaleString()} XP</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Badges</p>
                <p className="font-display font-bold text-slate-900">{u._count?.badges || 0}</p>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full rounded-xl gap-2 font-bold text-xs"
              onClick={() => handleAddFriend(u.id)}
              disabled={requesting[u.id]}
            >
              {requesting[u.id] ? 'Sending...' : <><Icons.UserPlus size={14} /> Add Friend</>}
            </Button>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

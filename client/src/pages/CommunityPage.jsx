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
    <div className="max-w-6xl mx-auto pb-32 animate-fade-in space-y-16 pt-10 px-6 font-sans">
      {/* ─── HEADER ─── */}
      <div className="relative">
        <div className="absolute top-[-50px] left-[-30px] w-48 h-48 bg-blue-600/5 blur-[80px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-lg mb-6 inline-block border border-blue-500/10">
              Global Network
            </span>
            <h1 className="font-display font-black text-6xl text-white tracking-tighter leading-none mb-4">
              Arena Nodes.
            </h1>
            <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
              Real-time synchronization with architects across the core sectors. Establish peer-to-peer handshakes to track development throughput.
            </p>
          </div>
          <div className="flex gap-4 p-4 rounded-3xl bg-white/3 border border-white/5 backdrop-blur-md">
            <div className="px-6 py-2 border-r border-white/5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Nodes</p>
              <p className="font-display font-black text-2xl text-white">{users.length.toString().padStart(2, '0')}</p>
            </div>
            <div className="px-6 py-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Pulse Status</p>
              <p className="font-display font-black text-2xl text-emerald-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── INCOMING HANDSHAKES ─── */}
      {requests.length > 0 && (
        <div className="relative group p-10 bg-blue-600/5 border border-blue-500/10 rounded-[40px] overflow-hidden animate-slide-up">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[60px] pointer-events-none" />
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Icons.UserPlus size={22} className="text-blue-500" />
            </div>
            <div>
              <h2 className="font-display font-black text-2xl text-white tracking-tight">Incoming Handshakes</h2>
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1">Pending peer synchronization</p>
            </div>
            <span className="ml-auto bg-blue-600 text-white font-black text-xs px-4 py-1.5 rounded-full shadow-lg shadow-blue-600/20">
              {requests.length} REQUESTS
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map(req => (
              <div key={req.id} className="bg-[#0A0A0F]/80 border border-white/5 rounded-3xl p-6 flex items-center gap-5 backdrop-blur-xl shadow-xl hover:border-blue-500/30 transition-all duration-500">
                <div className="relative">
                   <Avatar user={req.sender} size={56} className="border-2 border-blue-500/20 rounded-2xl" />
                   <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center border-2 border-[#0A0A0F]">
                     <Icons.Zap size={10} className="text-white" />
                   </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-black text-white truncate text-base mb-0.5 tracking-tight uppercase">{req.sender.username}</p>
                  <p className="font-mono text-[9px] text-blue-500 font-black uppercase tracking-[0.2em]">LVL {Math.floor((req.sender.xp || 0) / 1000) + 1} · {req.sender.xp.toLocaleString()} XP</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => handleAccept(req.id)}
                    className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-90"
                  >
                    <Icons.Check size={20} />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 text-slate-500 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all active:scale-90">
                    <Icons.X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── DISCOVER NODES ─── */}
      <div className="space-y-10">
        <div className="flex items-center justify-between border-b border-white/5 pb-8">
          <div>
            <h2 className="font-display font-black text-4xl text-white tracking-tight leading-none uppercase">
              Discover <span className="text-blue-500">Architects.</span>
            </h2>
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.3em] mt-3 font-black">Scanning network for compatible peers...</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative group">
               <Icons.Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search sector..." 
                 className="bg-white/3 border border-white/5 rounded-2xl py-3 pl-11 pr-6 font-mono text-[11px] text-white outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all w-64"
               />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map(u => (
            <div key={u.id} className="group relative bg-[#0A0A0F]/40 border border-white/5 rounded-[32px] p-8 hover:bg-[#0A0A0F]/60 hover:border-blue-500/20 transition-all duration-700 backdrop-blur-sm flex flex-col shadow-2xl overflow-hidden animate-slide-up">
              <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-blue-600/5 blur-[60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="flex items-center gap-6 mb-8 relative z-10">
                <div className="relative">
                  <Avatar user={u} size={64} className="rounded-[20px] ring-1 ring-white/10 group-hover:ring-blue-500/50 transition-all duration-500" />
                  <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0A0A0F] ${u.xp > 5000 ? 'bg-amber-500' : 'bg-slate-700'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-black text-2xl text-white truncate tracking-tight uppercase group-hover:text-blue-400 transition-colors">{u.username}</h3>
                  <p className="font-mono text-[9px] text-blue-500 font-black uppercase tracking-[0.2em] mt-1 opacity-70 group-hover:opacity-100 transition-all">{u.role || 'Junior Architect'}</p>
                </div>
                <button 
                  onClick={() => navigate(`/u/${u.username}`)}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-blue-600 transition-all transform hover:rotate-12"
                >
                  <Icons.User size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                <div className="bg-[#11111A] rounded-2xl p-4 border border-white/5 group-hover:bg-blue-600/5 group-hover:border-blue-500/10 transition-all">
                  <p className="text-[9px] uppercase font-black text-slate-600 tracking-[0.2em] mb-2 leading-none">THROUGHPUT</p>
                  <p className="font-display font-black text-xl text-white leading-tight">{(u.xp || 0).toLocaleString()} <span className="text-[10px] text-slate-500 ml-1">XP</span></p>
                </div>
                <div className="bg-[#11111A] rounded-2xl p-4 border border-white/5 group-hover:bg-blue-600/5 group-hover:border-blue-500/10 transition-all">
                  <p className="text-[9px] uppercase font-black text-slate-600 tracking-[0.2em] mb-2 leading-none">ARTIFACTS</p>
                  <p className="font-display font-black text-xl text-white leading-tight">{u._count?.badges || 0} <span className="text-[10px] text-slate-500 ml-1">NODES</span></p>
                </div>
              </div>

              <button 
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] transition-all relative z-10 shadow-lg ${
                  requesting[u.id] 
                    ? 'bg-blue-600/50 text-white cursor-wait' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 active:scale-95'
                }`}
                onClick={() => handleAddFriend(u.id)}
                disabled={requesting[u.id]}
              >
                {requesting[u.id] ? (
                  <><Spinner className="w-3 h-3 border-white/30 border-t-white" /> SYNCHRONIZING...</>
                ) : (
                  <><Icons.UserPlus size={16} /> Establish Handshake</>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

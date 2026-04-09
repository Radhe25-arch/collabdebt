import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store';
import { Avatar, Spinner } from '@/components/ui';
import { Search, Users, Shield, Zap, Flame, UserPlus, MessageSquare } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function CommunityPage() {
  const { user: me } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    // Reusing admin getUsers logic but for public community (filtered for safety if needed, 
    // but here we just fetch all to show real users)
    api.get('/admin/users', { params: { limit: 100 } })
      .then(r => setUsers(r.data.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(u => 
      u.username?.toLowerCase().includes(q) || 
      u.fullName?.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto pb-24 animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-[4px] border border-cyber/30 flex items-center justify-center">
              <Users size={14} className="text-cyber" />
            </div>
            <span className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.25em]">OPERATIVE DIRECTORY</span>
          </div>
          <h1 className="font-black text-3xl text-white tracking-tight uppercase">THE COLLECTIVE</h1>
          <p className="font-mono text-[11px] text-[#555] font-bold mt-1 uppercase tracking-wider">
            {users.length} VERIFIED UNITS ONLINE
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="LOCATE OPERATIVE..."
            className="w-full bg-white/[0.02] border border-white/[0.08] rounded-[4px] pl-10 pr-4 py-2.5 font-mono text-[11px] text-white focus:outline-none focus:border-cyber/50 transition-all uppercase tracking-widest"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-40 flex justify-center">
          <Spinner size={32} className="text-cyber" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map(u => (
            <div 
              key={u.id}
              className="blade p-5 hover:border-cyber/30 transition-all group relative overflow-hidden"
            >
              {/* Status Glow */}
              <div className="absolute top-0 right-0 p-3">
                 <div className={`w-1.5 h-1.5 rounded-full ${u.lastActiveAt && (new Date() - new Date(u.lastActiveAt)) < 600000 ? 'bg-emerald animate-pulse' : 'bg-[#222]'}`} />
              </div>

              <div className="flex items-center gap-4 mb-5">
                <Avatar user={u} size={48} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-mono text-sm font-black text-white truncate uppercase tracking-tight group-hover:text-cyber transition-colors">
                    {u.username}
                  </h3>
                  <p className="font-mono text-[9px] font-bold text-[#444] uppercase">LEVEL {u.level || 1} ENGINEER</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5 pt-4 border-t border-white/[0.04]">
                <div className="flex flex-col">
                  <span className="font-mono text-[8px] font-black text-[#333] uppercase">TELEMETRY</span>
                  <span className="font-mono text-[10px] font-black text-white">{(u.xp || 0).toLocaleString()} XP</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[8px] font-black text-[#333] uppercase">STREAK</span>
                  <span className="font-mono text-[10px] font-black text-amber-500">{u.streak || 0} DAY</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link 
                  to={`/u/${u.username}`}
                  className="flex-1 bg-white/[0.03] border border-white/[0.08] hover:border-cyber/50 hover:bg-cyber/10 py-2 rounded-[4px] flex items-center justify-center transition-all"
                >
                  <span className="font-mono text-[9px] font-black text-[#666] group-hover:text-cyber uppercase tracking-widest">PROTOCOL_VIEW</span>
                </Link>
                {me?.id !== u.id && (
                  <button 
                    onClick={() => toast.success(`HANDSHAKE SENT TO ${u.username}`)}
                    className="w-10 h-10 border border-white/[0.08] hover:border-cyber/50 flex items-center justify-center rounded-[4px] transition-all"
                  >
                    <UserPlus size={14} className="text-[#444] hover:text-cyber" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="col-span-full py-40 text-center border border-dashed border-white/[0.08] rounded-xl bg-white/[0.01]">
               <Shield size={48} className="mx-auto text-[#111] mb-6" />
               <p className="font-mono text-xs text-[#444] font-black uppercase tracking-[0.2em]">NO COMPATIBLE OPERATIVES IDENTIFIED</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

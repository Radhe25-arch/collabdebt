import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '@/store';
import { Avatar } from '@/components/ui';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, MessageSquare, Terminal,
  Keyboard, HelpCircle, Shield, Menu, Bell, ChevronRight,
  Zap, Code, Trophy, Settings, User, X, Activity, Cpu, Layers
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ─── SIDEBAR COMPONENT ────────────────────────────────────
function Sidebar({ open }) {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const nav = [
    { label: 'Dashboard',  path: '/dashboard', icon: LayoutDashboard },
    { label: 'Curriculum', path: '/courses',   icon: BookOpen },
    { label: 'AI Mentor',  path: '/mentor',    icon: MessageSquare },
    { label: 'Lab Hub',    path: '/lab',       icon: Terminal },
    { label: 'Typing Lab', path: '/typing',    icon: Keyboard },
    { label: 'Leaderboard',path: '/leaderboard',icon: Trophy },
    { label: 'Battles',    path: '/arena',     icon: Shield },
    { label: 'Settings',   path: '/settings',  icon: Settings },
  ];

  return (
    <aside
      className="fixed left-0 top-0 h-screen z-[100] flex flex-col bg-black border-r border-white/5 transition-all duration-500 overflow-hidden shadow-2xl"
      style={{ width: open ? 280 : 0 }}
    >
      {/* Brand Header */}
      <div className="p-8 border-b border-white/5 flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
         <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:rotate-6 transition-transform">
            <Code size={20} className="text-white" />
         </div>
         <span className="font-black text-xl tracking-tighter text-white uppercase italic whitespace-nowrap">SkillForge</span>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2 custom-scrollbar">
        {nav.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group relative border ${
                isActive 
                  ? 'bg-blue-600/10 border-blue-600/20 text-blue-400' 
                  : 'border-transparent text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] italic whitespace-nowrap">{item.label}</span>
              {isActive && (
                <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full shadow-[0_0_10px_#2563eb]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Session Footer */}
      {user && (
        <div className="px-6 py-10 bg-[#050505] border-t border-white/5">
          <Link
            to="/profile"
            className="flex flex-col gap-5 p-5 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-blue-600/[0.02] group-hover:bg-blue-600/5 transition-colors" />
            <div className="flex items-center gap-4 relative z-10 w-full overflow-hidden">
              <Avatar user={user} size={48} className="border-2 border-white/10 group-hover:border-blue-500/50 transition-colors rounded-2xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate tracking-tight uppercase italic group-hover:text-blue-400">
                  {user?.username}
                </p>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-0.5 whitespace-nowrap">ELITE OPERATIVE</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5 relative z-10">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Rank</span>
                  <span className="text-xs font-black text-blue-500 italic uppercase">Level {user?.level || 1}</span>
               </div>
               <div className="flex flex-col text-right">
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1 text-right">Streak</span>
                  <span className="text-xs font-black text-amber-500 italic uppercase">{user?.streak || 0} Cycles</span>
               </div>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}

// ─── TOPBAR COMPONENT ─────────────────────────────────────
function Topbar({ open, toggle }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = notifs.filter(n => !n.read).length;

  const fetchNotifs = () =>
    api.get('/notifications')
      .then(r => setNotifs(r.data.notifications || []))
      .catch(() => {});

  useEffect(() => {
    if (!user) return;
    fetchNotifs();
    const id = setInterval(fetchNotifs, 15000);
    return () => clearInterval(id);
  }, [user]);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`).catch(() => {});
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleBattleAccept = async (id, battleId) => {
    try {
      await api.post(`/battles/${battleId}/respond`, { accept: true });
      await markRead(id);
      setNotifOpen(false);
      navigate(`/battles/${battleId}`);
    } catch { toast.error('FAILED TO INITIATE'); }
  };

  return (
    <header 
      className="fixed top-0 right-0 h-20 bg-black/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-10 transition-all duration-500"
      style={{ left: open ? 280 : 0 }}
    >
      <div className="flex items-center gap-6">
        <button onClick={toggle} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5">
           <Menu size={18} className="text-white" />
        </button>
        
        <div className="hidden md:flex items-center gap-10">
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1">SYSTEM_TELEMETRY</span>
              <div className="flex items-center gap-3">
                 <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => <div key={i} className={`w-1 h-3 ${i < 5 ? 'bg-emerald-500' : 'bg-emerald-500/20'} rounded-full`} />)}
                 </div>
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Stable</span>
              </div>
           </div>
           
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1">GLOBAL_XP</span>
              <span className="text-sm font-black text-white italic uppercase tracking-widest">{(user?.xp || 0).toLocaleString()} UNITS</span>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
         {user && (
           <>
              <div className="relative">
                 <button 
                   onClick={() => setNotifOpen(!notifOpen)}
                   className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 relative"
                 >
                    <Bell size={18} className="text-slate-400 group-hover:text-white" />
                    {unread > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]" />}
                 </button>

                 <AnimatePresence>
                    {notifOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-96 bg-black border border-white/10 rounded-[32px] shadow-2xl overflow-hidden z-[100]"
                      >
                         <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <span className="text-[11px] font-black text-white uppercase tracking-widest italic">Notifications</span>
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest cursor-pointer">Clear All</span>
                         </div>
                         <div className="max-h-96 overflow-y-auto custom-scrollbar">
                            {notifs.length === 0 ? (
                              <div className="p-10 text-center">
                                 <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest italic">No New Data</p>
                              </div>
                            ) : notifs.map(n => (
                              <div key={n.id} className="p-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => markRead(n.id)}>
                                 <p className="text-sm font-bold text-white mb-1 uppercase tracking-tight italic">{n.title}</p>
                                 <p className="text-xs text-slate-500 leading-relaxed italic">{n.body}</p>
                                 {n.type === 'BATTLE_INVITE' && !n.read && (
                                   <div className="mt-4 flex gap-3">
                                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg h-8 px-4 font-black text-[9px] uppercase tracking-widest" onClick={(e) => { e.stopPropagation(); handleBattleAccept(n.id, n.data?.battleId); }}>Join Fight</Button>
                                   </div>
                                 )}
                              </div>
                            ))}
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              <button 
                onClick={() => navigate('/settings')}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
              >
                 <Settings size={18} className="text-slate-400 group-hover:text-white" />
              </button>

              <Link to="/profile">
                 <Avatar user={user} size={40} className="border-2 border-white/5 hover:border-blue-500 transition-colors cursor-pointer rounded-xl" />
              </Link>
           </>
         )}
      </div>
    </header>
  );
}

// ─── MAIN LAYOUT COMPONENT ────────────────────────────────
export default function AppLayout() {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-blue-600/30">
      <Sidebar open={sidebarOpen} />
      <Topbar open={sidebarOpen} toggle={toggleSidebar} />
      
      <main
        className="transition-all duration-500 pt-20"
        style={{ paddingLeft: sidebarOpen ? 0 : 0, marginLeft: sidebarOpen ? 280 : 0 }}
      >
        <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full">
           <Outlet />
        </div>
      </main>

      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[#000000] pointer-events-none z-[-1]" />
      <div className="fixed top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)] pointer-events-none z-[-1]" />
    </div>
  );
}

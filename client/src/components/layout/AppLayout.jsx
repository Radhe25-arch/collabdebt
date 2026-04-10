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
    { label: 'Command',    path: '/dashboard', icon: LayoutDashboard },
    { label: 'Archive',    path: '/courses',   icon: BookOpen },
    { label: 'Advisor',    path: '/mentor',    icon: MessageSquare },
    { label: 'Hub',        path: '/lab',       icon: Terminal },
    { label: 'Arena',      path: '/arena',     icon: Shield },
    { label: 'Hierarchy',  path: '/leaderboard',icon: Trophy },
    { label: 'Registry',   path: '/profile',   icon: User },
    { label: 'Systems',    path: '/settings',  icon: Settings },
  ];

  return (
    <aside
      className="fixed left-0 top-0 h-screen z-[100] flex flex-col bg-black border-r border-white/5 transition-all duration-500 overflow-hidden"
      style={{ width: open ? 260 : 0 }}
    >
      {/* Ghost Branding */}
      <div className="p-10 border-b border-white/5 flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
         <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
            <Code size={12} className="text-black" />
         </div>
         <span className="font-bold text-base tracking-tight text-white uppercase italic whitespace-nowrap">SkillForge</span>
      </div>

      {/* Minimalism Nav */}
      <nav className="flex-1 overflow-y-auto px-6 py-12 space-y-4">
        {nav.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-2 hover:translate-x-1 transition-all group relative ${
                isActive ? 'text-white' : 'text-slate-600 hover:text-slate-300'
              }`}
            >
              <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] italic whitespace-nowrap">{item.label}</span>
              {isActive && (
                <motion.div layoutId="nav-dot" className="absolute -left-6 w-1 h-4 bg-white rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Registry Identity */}
      {user && (
        <div className="p-10 bg-[#050505] border-t border-white/5">
           <div className="flex flex-col gap-8 opacity-40 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => navigate('/profile')}>
              <div className="flex items-center gap-4">
                 <Avatar user={user} size={32} className="rounded-lg grayscale" />
                 <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-white truncate uppercase italic">{user?.username}</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Registry Active</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </aside>
  );
}

// ─── TOPBAR COMPONENT ─────────────────────────────────────
function Topbar({ open, toggle }) {
  const { user } = useAuthStore();
  const [notifs, setNotifs] = useState([]);
  const unread = notifs.filter(n => !n.read).length;

  useEffect(() => {
    if (!user) return;
    const fetchNotifs = () => api.get('/notifications').then(r => setNotifs(r.data.notifications || [])).catch(() => {});
    fetchNotifs();
    const id = setInterval(fetchNotifs, 15000);
    return () => clearInterval(id);
  }, [user]);

  return (
    <header 
      className="fixed top-0 right-0 h-20 bg-black/60 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-10 transition-all duration-500"
      style={{ left: open ? 260 : 0 }}
    >
      <div className="flex items-center gap-10">
        <button onClick={toggle} className="p-2 text-slate-500 hover:text-white transition-colors">
           <Menu size={16} />
        </button>
        
        <div className="hidden md:flex items-center gap-12 border-l border-white/5 pl-10 h-6">
           <div className="flex flex-col">
              <span className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.4em] mb-1 italic">Internal_Uptime</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest italic">100.00% OPERATIONAL</span>
           </div>
           
           <div className="flex flex-col">
              <span className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.4em] mb-1 italic">Registry_XP</span>
              <span className="text-[11px] font-black text-white italic uppercase tracking-widest">{(user?.xp || 0).toLocaleString()} UNITS</span>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
         <div className="relative">
            <button className="text-slate-500 hover:text-white transition-colors">
               <Bell size={16} strokeWidth={2} />
               {unread > 0 && <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white rounded-full" />}
            </button>
         </div>
         <div className="w-[1px] h-4 bg-white/5" />
         <Avatar user={user} size={30} className="rounded-full grayscale cursor-pointer hover:grayscale-0 transition-all" />
      </div>
    </header>
  );
}

// ─── MAIN LAYOUT COMPONENT ────────────────────────────────
export default function AppLayout() {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-white selection:text-black overflow-x-hidden">
      <Sidebar open={sidebarOpen} />
      <Topbar open={sidebarOpen} toggle={toggleSidebar} />
      
      <main
        className="transition-all duration-500 pt-20"
        style={{ marginLeft: sidebarOpen ? 260 : 0 }}
      >
        <div className="p-10 lg:p-20 max-w-[1400px] mx-auto w-full">
           <Outlet />
        </div>
      </main>

      {/* Subtle Depth Layers */}
      <div className="fixed inset-0 bg-[#000000] pointer-events-none z-[-1]" />
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.01)_0%,transparent_70%)] pointer-events-none z-[-1]" />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '@/store';
import { Avatar } from '@/components/ui';
import api from '@/lib/api';
import {
  LayoutDashboard, BookOpen, MessageSquare, Terminal,
  Keyboard, HelpCircle, Shield, Menu, Bell, ChevronRight,
  Zap, Code, Trophy, Settings, User, X
} from 'lucide-react';

const MAIN_LINKS = [
  { to: '/dashboard',     label: 'HOME',          Icon: LayoutDashboard },
  { to: '/courses',       label: 'ARCHIVE',       Icon: BookOpen },
  { to: '/mentor',        label: 'AI MENTOR',     Icon: Terminal },
  { to: '/battles',       label: 'THE ARENA',     Icon: Zap },
  { to: '/leaderboard',   label: 'HALL OF FAME',  Icon: Trophy },
  { to: '/community',     label: 'COMMUNITY',     Icon: User },
  { to: '/lab',           label: 'THE LAB',       Icon: Code },
  { to: '/settings',      label: 'SYSTEM',        Icon: Settings },
];

const BOTTOM_LINKS = [
  { to: '/support', label: 'SUPPORT', Icon: HelpCircle },
  { to: '/privacy', label: 'PRIVACY', Icon: Shield },
];

function NavItem({ to, label, Icon }) {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== '/dashboard' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-[4px] transition-all duration-150 group ${
        isActive
          ? 'bg-cyber/[0.08] text-cyber border border-cyber/20'
          : 'text-[#666] hover:text-white hover:bg-white/[0.03] border border-transparent'
      }`}
    >
      <Icon size={15} strokeWidth={1.5} className="flex-shrink-0" />
      <span className="font-mono text-[11px] font-bold tracking-[0.1em]">{label}</span>
      {isActive && (
        <div className="ml-auto w-1 h-4 bg-cyber rounded-none" />
      )}
    </Link>
  );
}

function Sidebar({ open }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <aside
      className="fixed left-0 top-0 h-screen z-40 flex flex-col overflow-hidden transition-all duration-300"
      style={{ 
        width: open ? 240 : 0,
        background: '#000',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 h-16 flex-shrink-0 cursor-pointer"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        onClick={() => navigate('/')}
      >
        <div className="w-7 h-7 rounded-[4px] border border-cyber/30 flex items-center justify-center flex-shrink-0">
          <Code size={14} strokeWidth={1.5} className="text-cyber" />
        </div>
        <span className="font-mono font-black text-sm text-white tracking-[0.15em] uppercase whitespace-nowrap">
          SkillForge
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-1 custom-scrollbar">
        {MAIN_LINKS.map(item => <NavItem key={item.to} {...item} />)}

        <div className="divider-h my-4" />

        {BOTTOM_LINKS.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-[#444] hover:text-white hover:bg-white/[0.03] transition-all duration-150"
          >
            <item.Icon size={14} strokeWidth={1.5} />
            <span className="font-mono text-[10px] font-bold tracking-[0.1em]">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User Identity — Industrial Dark Premium */}
      {user && (
        <div
          className="px-3 py-6 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, transparent 0%, rgba(59,130,246,0.02) 100%)' }}
        >
          <div className="flex items-center justify-between mb-4 px-1">
             <p className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.3em]">
               OPERATIVE_ID
             </p>
             <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
          </div>
          
          <Link
            to="/profile"
            className="flex flex-col gap-4 p-4 rounded-[4px] border border-white/[0.08] bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 group relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-cyber/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-3 relative z-10">
              <Avatar user={user} size={36} className="border border-white/10 group-hover:border-cyber/30 transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[12px] font-black text-white truncate tracking-tighter uppercase group-hover:text-cyber transition-colors">
                  {user?.username}
                </p>
                <p className="font-mono text-[9px] font-bold text-[#555] opacity-80 uppercase">VERIFIED_UNIT</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.04]">
               <div className="flex flex-col">
                  <span className="font-mono text-[8px] font-black text-[#444] uppercase tracking-widest">RANK</span>
                  <span className="font-mono text-[10px] font-black text-cyber">LV {user?.level || 1}</span>
               </div>
               <div className="flex flex-col">
                  <span className="font-mono text-[8px] font-black text-[#444] uppercase tracking-widest">STREAK</span>
                  <span className="font-mono text-[10px] font-black text-amber">{user?.streak || 0} DAY</span>
               </div>
            </div>
            
            <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
               <div className="h-full bg-cyber" style={{ width: '65%' }} />
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}

function Topbar({ sidebarOpen, toggleSidebar }) {
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

  const markAllRead = async () => {
    await api.patch('/notifications/read-all').catch(() => {});
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

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
    } catch { toast.error('FAILED TO ACCEPT'); }
  };

  const handleBattleDecline = async (id, battleId) => {
    try {
      await api.post(`/battles/${battleId}/respond`, { accept: false });
      await markRead(id);
    } catch { toast.error('FAILED TO DECLINE'); }
  };

  return (
    <header
      style={{
        left: sidebarOpen ? 240 : 0,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
      className="fixed top-0 right-0 z-30 h-16 flex items-center justify-between px-6 transition-all duration-300"
    >
      {/* Left — hamburger */}
      <div className="flex items-center gap-6">
        <button
          onClick={toggleSidebar}
          className="text-[#666] hover:text-white transition-colors duration-150 p-1"
        >
          <Menu size={18} strokeWidth={1.5} />
        </button>
        {!sidebarOpen && (
          <div className="flex items-center gap-2">
            <Code size={14} strokeWidth={1.5} className="text-cyber" />
            <span className="font-mono font-black text-xs text-white tracking-[0.15em] uppercase">
              SKILLFORGE
            </span>
          </div>
        )}
        
        {/* Live Telemetry */}
        <div className="hidden md:flex items-center gap-8 pl-6 border-l border-white/[0.08]">
           <div className="flex flex-col">
              <span className="font-mono text-[10px] font-black text-[#444] uppercase tracking-widest">SYSTEM_STABILITY</span>
              <div className="flex items-center gap-2 mt-0.5">
                 <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-0.5 h-2 ${i < 5 ? 'bg-emerald' : 'bg-emerald/30'}`} />)}
                 </div>
                 <span className="font-mono text-[10px] font-black text-emerald uppercase">OPTIMAL</span>
              </div>
           </div>
           
           <div className="flex flex-col">
              <span className="font-mono text-[10px] font-black text-[#444] uppercase tracking-widest">XP_TELEMETRY</span>
              <span className="font-mono text-[10px] font-black text-white mt-0.5 uppercase">{(user?.xp || 0).toLocaleString()} UNITS</span>
           </div>

           <div className="flex flex-col">
              <span className="font-mono text-[10px] font-black text-[#444] uppercase tracking-widest">DRIVE_STREAK</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <Zap size={10} className="text-amber fill-amber/20" />
                 <span className="font-mono text-[10px] font-black text-amber uppercase">{user?.streak || 0} DAYS</span>
              </div>
           </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {user && (
          <>
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(v => !v); if (!notifOpen) fetchNotifs(); }}
                className="relative text-[#666] hover:text-white transition-colors duration-150"
              >
                <Bell size={17} strokeWidth={1.5} />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-crimson rounded-[2px] text-white flex items-center justify-center text-[8px] font-mono font-black">
                    {unread}
                  </span>
                )}
              </button>

              {/* Notification Dropdown — Glassmorphism */}
              {notifOpen && (
                <div
                  className="absolute right-0 top-10 w-80 z-50"
                  style={{
                    background: 'rgba(0,0,0,0.90)',
                    backdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '4px',
                  }}
                >
                  <div
                    className="px-4 py-3 flex justify-between items-center"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="font-mono text-[11px] font-black text-white uppercase tracking-[0.1em]">
                      NOTIFICATIONS
                    </span>
                    {unread > 0 && (
                      <button onClick={markAllRead} className="font-mono text-[10px] text-cyber hover:text-white transition-colors uppercase tracking-wider">
                        MARK ALL READ
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto custom-scrollbar">
                    {notifs.length === 0 ? (
                      <p className="px-4 py-8 text-center text-[11px] text-[#444] font-mono uppercase tracking-wider">
                        NO NOTIFICATIONS
                      </p>
                    ) : notifs.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                          n.read
                            ? 'hover:bg-white/[0.02]'
                            : 'bg-cyber/[0.04] hover:bg-cyber/[0.07]'
                        }`}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      >
                        <div className="flex items-start gap-2">
                          {!n.read && (
                            <div className="w-1.5 h-1.5 rounded-[1px] bg-cyber mt-1.5 flex-shrink-0" />
                          )}
                          <div className={!n.read ? '' : 'pl-3.5'}>
                            <p className="text-xs font-bold text-white">{n.title || 'NOTIFICATION'}</p>
                            <p className="text-[11px] text-[#666] mt-0.5">{n.body || n.message || ''}</p>
                            {n.type === 'BATTLE_INVITE' && !n.read && (
                              <div className="flex gap-2 mt-2">
                                <button onClick={(e) => { e.stopPropagation(); handleBattleAccept(n.id, n.data?.battleId); }} className="px-3 py-1 bg-emerald/10 text-emerald border border-emerald/30 hover:bg-emerald/20 transition-all rounded-[4px] font-mono font-black text-[9px] uppercase tracking-widest">Accept</button>
                                <button onClick={(e) => { e.stopPropagation(); handleBattleDecline(n.id, n.data?.battleId); }} className="px-3 py-1 bg-crimson/10 text-crimson border border-crimson/30 hover:bg-crimson/20 transition-all rounded-[4px] font-mono font-black text-[9px] uppercase tracking-widest">Decline</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick nav */}
            <button
              onClick={() => navigate('/settings')}
              className="text-[#666] hover:text-white transition-colors duration-150"
            >
              <Settings size={16} strokeWidth={1.5} />
            </button>

            {/* Avatar */}
            <Link to="/profile">
              <Avatar user={user} size={30} className="hover:border-white/20 transition-colors duration-150" />
            </Link>
          </>
        )}

        {!user && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="font-mono text-[11px] font-bold text-[#666] hover:text-white transition-colors uppercase tracking-wider"
            >
              LOG IN
            </button>
            <button
              onClick={() => navigate('/register')}
              className="font-mono text-[11px] font-black px-4 py-2 bg-cyber text-white rounded-[4px] hover:bg-[#2563EB] transition-colors duration-150 uppercase tracking-wider"
            >
              SIGN UP
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default function AppLayout() {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <Sidebar open={sidebarOpen} />
      <Topbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        style={{ marginLeft: sidebarOpen ? 240 : 0 }}
        className="transition-all duration-300 pt-16 min-h-screen"
      >
        <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

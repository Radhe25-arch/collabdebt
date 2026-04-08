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
  { to: '/dashboard',   label: 'HOME',       Icon: LayoutDashboard },
  { to: '/courses',     label: 'CATALOG',    Icon: BookOpen },
  { to: '/forum',       label: 'COMMUNITY',  Icon: MessageSquare },
  { to: '/mentor',      label: 'AI MENTOR',  Icon: Terminal },
  { to: '/typing-test', label: 'SPEED TEST', Icon: Keyboard },
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
      style={{ width: open ? 240 : 0 }}
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

      {/* User Identity */}
      {user && (
        <div
          className="px-3 py-4 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="font-mono text-[9px] font-bold text-[#333] uppercase tracking-[0.2em] mb-3 px-1">
            SECURITY IDENTITY
          </p>
          <Link
            to="/profile"
            className="flex items-center gap-3 p-3 rounded-[4px] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02] transition-all duration-150 group"
          >
            <Avatar user={user} size={32} />
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[11px] font-black text-white truncate tracking-wide uppercase">
                {user?.username}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-[9px] font-bold text-cyber">LV {user?.level || 1}</span>
                <span className="text-[#333]">·</span>
                <span className="font-mono text-[9px] font-bold text-[#555]">{(user?.xp || 0).toLocaleString()} XP</span>
              </div>
            </div>
            <ChevronRight size={12} strokeWidth={1.5} className="text-[#333] group-hover:text-[#666] transition-colors" />
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
      <div className="flex items-center gap-4">
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

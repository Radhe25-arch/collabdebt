import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '@/store';
import { Avatar, XPBar } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';

const NAV_CORE = [
  { to: '/dashboard',   label: 'Dashboard',   Icon: Icons.Home },
  { to: '/courses',     label: 'Courses',     Icon: Icons.Courses },
  { to: '/leaderboard', label: 'Leaderboard', Icon: Icons.Leaderboard },
  { to: '/tournaments', label: 'Tournaments', Icon: Icons.Tournament },
];

const NAV_ARENA = [
  { to: '/battles',   label: '1v1 Battles',   Icon: Icons.Zap },
  { to: '/quests',    label: 'Daily Quests',  Icon: Icons.Target },
  { to: '/mentor',    label: 'AI Mentor',     Icon: Icons.Shield },
  { to: '/rooms',     label: 'Code Rooms',    Icon: Icons.Code },
  { to: '/portfolio', label: 'Portfolio',     Icon: Icons.ExternalLink },
];

const NAV_ACCOUNT = [
  { to: '/profile',  label: 'Profile',  Icon: Icons.Profile },
  { to: '/settings', label: 'Settings', Icon: Icons.Settings },
];

const LEVEL_NAMES = ['Beginner','Apprentice','Coder','Developer','Senior Dev','Architect','Pro','Expert','Master','Legend'];
const THRESHOLDS  = [0,500,1200,2500,4500,7500,12000,18000,26000,36000];

const PAGE_TITLES = {
  '/dashboard':'Dashboard', '/courses':'Courses', '/leaderboard':'Leaderboard',
  '/tournaments':'Tournaments', '/battles':'1v1 Battles', '/quests':'Daily Quests',
  '/mentor':'AI Mentor', '/rooms':'Code Rooms', '/portfolio':'Portfolio Builder',
  '/profile':'Profile', '/settings':'Settings', '/admin':'Admin Panel',
};

function NavSection({ items }) {
  return items.map(({ to, label, Icon }) => (
    <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
      <Icon size={15} />
      <span className="whitespace-nowrap text-sm">{label}</span>
    </NavLink>
  ));
}

function Sidebar({ open }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const lvl    = Math.min(user?.level || 1, 10);
  const xp     = user?.xp || 0;
  const nextXP = THRESHOLDS[lvl] || xp;
  const prevXP = THRESHOLDS[lvl - 1] || 0;

  return (
    <aside
      style={{ width: open ? 240 : 0 }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col bg-arena-bg2 border-r border-arena-border overflow-hidden transition-all duration-300"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-arena-border flex-shrink-0">
        <div className="w-7 h-7 rounded-md bg-purple-teal flex items-center justify-center">
          <Icons.Code size={13} className="text-white" />
        </div>
        <span className="font-display font-bold text-base text-gradient tracking-tight whitespace-nowrap">SkillForge</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        <NavSection items={NAV_CORE} />

        <div className="my-2.5 mx-1 h-px bg-arena-border" />
        <p className="px-3 pb-1 font-mono text-xs text-arena-dim uppercase tracking-widest">Arena</p>
        <NavSection items={NAV_ARENA} />

        <div className="my-2.5 mx-1 h-px bg-arena-border" />
        <NavSection items={NAV_ACCOUNT} />

        {user?.role === 'ADMIN' && (
          <NavLink to="/admin" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icons.Admin size={15} />
            <span className="whitespace-nowrap text-sm">Admin</span>
          </NavLink>
        )}
      </nav>

      {/* User XP card */}
      {user && (
        <div className="mx-3 mb-3 p-3 rounded-lg bg-arena-bg3 border border-arena-border">
          <div className="flex items-center gap-2.5 mb-2.5">
            <Avatar user={user} size={32} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-arena-text truncate whitespace-nowrap">{user.username}</p>
              <p className="text-xs font-mono text-arena-dim">{LEVEL_NAMES[lvl - 1]} · Lv{lvl}</p>
            </div>
            <div className="flex items-center gap-1 text-orange-400">
              <Icons.Fire size={12} />
              <span className="text-xs font-mono font-bold">{user.streak || 0}</span>
            </div>
          </div>
          <XPBar current={xp - prevXP} max={nextXP - prevXP} level={lvl} levelName={LEVEL_NAMES[lvl-1]} showLabel={false} />
        </div>
      )}

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-arena-border pt-3">
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="sidebar-link w-full text-arena-dim hover:text-red-400"
        >
          <Icons.LogOut size={15} />
          <span className="whitespace-nowrap text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

function Topbar({ sidebarOpen, toggleSidebar }) {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifs, setNotifs]       = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const fetchNotifs = () => api.get('/notifications').then(r => setNotifs(r.data.notifications || [])).catch(() => {});
    fetchNotifs();
    const id = setInterval(fetchNotifs, 10000); // Poll every 10s
    return () => clearInterval(id);
  }, []);

  // Match nested paths too
  const title = Object.entries(PAGE_TITLES).find(([path]) =>
    location.pathname === path || location.pathname.startsWith(path + '/')
  )?.[1] || 'SkillForge';

  return (
    <header
      style={{ left: sidebarOpen ? 240 : 0 }}
      className="fixed top-0 right-0 z-30 h-14 flex items-center justify-between px-4 bg-arena-bg/90 backdrop-blur-md border-b border-arena-border transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="text-arena-dim hover:text-arena-text transition-colors p-1">
          <Icons.Menu size={18} />
        </button>
        
        <span className="font-display font-semibold text-sm text-arena-text">{title}</span>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden md:flex items-center gap-1.5 bg-arena-bg3 border border-arena-border rounded-lg px-3 py-1.5">
            <Icons.Zap size={12} className="text-arena-purple2" />
            <span className="font-mono text-xs text-arena-purple2 font-bold">{(user.xp || 0).toLocaleString()} XP</span>
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="relative text-arena-dim hover:text-arena-text transition-colors p-1.5"
          >
            <Icons.Bell size={17} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center font-mono text-xs leading-none">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 bg-arena-bg2 border border-arena-border rounded-xl shadow-2xl z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-arena-border flex justify-between items-center">
                <span className="font-display text-sm font-semibold">Notifications</span>
                {unread > 0 && (
                  <button
                    className="font-mono text-xs text-arena-teal hover:text-arena-teal2 transition-colors"
                    onClick={() => {
                      api.patch('/notifications/read-all');
                      setNotifs(n => n.map(x => ({ ...x, read: true })));
                    }}
                  >
                    mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-arena-border/50">
                {notifs.length === 0 ? (
                  <p className="px-4 py-8 text-center font-mono text-xs text-arena-dim">no notifications</p>
                ) : notifs.map(n => (
                  <div key={n.id} className={`px-4 py-3 ${!n.read ? 'bg-arena-purple/5' : ''}`}>
                    <p className="text-xs font-semibold text-arena-text">{n.title}</p>
                    <p className="text-xs font-mono text-arena-muted mt-0.5">{n.body}</p>
                    {n.type === 'BATTLE_INVITE' && !n.read && n.data?.battleId && (
                      <div className="flex gap-2 mt-2">
                        <button
                          className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-arena-teal/20 text-arena-teal border border-arena-teal/30 hover:bg-arena-teal/30 transition-colors"
                          onClick={async () => {
                            try {
                              await api.post(`/battles/${n.data.battleId}/respond`, { accept: true });
                              await api.patch(`/notifications/${n.id}/read`);
                              setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
                              setNotifOpen(false);
                              navigate(`/battles/${n.data.battleId}`);
                            } catch {}
                          }}
                        >Accept</button>
                        <button
                          className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                          onClick={async () => {
                            try {
                              await api.post(`/battles/${n.data.battleId}/respond`, { accept: false });
                              await api.patch(`/notifications/${n.id}/read`);
                              setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
                            } catch {}
                          }}
                        >Decline</button>
                      </div>
                    )}
                    {n.type === 'BATTLE_ACCEPTED' && !n.read && n.data?.battleId && (
                      <button
                        className="mt-2 px-3 py-1 rounded-md text-xs font-mono font-bold bg-arena-purple/20 text-arena-purple2 border border-arena-purple/30 hover:bg-arena-purple/30 transition-colors"
                        onClick={() => { setNotifOpen(false); navigate(`/battles/${n.data.battleId}`); }}
                      >Configure Match →</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {user && <Avatar user={user} size={30} className="cursor-pointer" />}
      </div>
    </header>
  );
}

export default function AppLayout() {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className="min-h-screen bg-arena-bg">
      <Sidebar open={sidebarOpen} />
      <Topbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        style={{ marginLeft: sidebarOpen ? 240 : 0 }}
        className="transition-all duration-300 pt-14 min-h-screen"
      >
        <div className="p-6 max-w-screen-xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

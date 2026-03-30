import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '@/store';
import { Avatar } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';

const MAIN_LINKS = [
  { to: '/dashboard',   label: 'Home',        Icon: Icons.Home },
  { to: '/courses',     label: 'Catalog',     Icon: Icons.Book },
  { to: '/mentor',      label: 'AI Mentor',   Icon: Icons.Terminal },
  { to: '/typing-test', label: 'Speed Test',  Icon: Icons.Keyboard },
  { to: '/quests',      label: 'Quests',      Icon: Icons.Target },
  { to: '/battles',     label: '1v1 Arena',   Icon: Icons.Zap },
  { to: '/tournaments', label: 'Tournaments', Icon: Icons.Trophy },
  { to: '/leaderboard', label: 'Rankings',    Icon: Icons.Leaderboard },
  { to: '/community',   label: 'Community',   Icon: Icons.Users },
  { to: '/friends',     label: 'Friends',     Icon: Icons.MessageSquare },
];

const BOTTOM_LINKS = [
  { to: '/support', label: 'Support', Icon: Icons.HelpCircle },
  { to: '/privacy', label: 'Privacy', Icon: Icons.Shield },
];

function NavItem({ to, label, Icon }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to) &&
    (to !== '/courses' || location.pathname === '/courses' || location.pathname.startsWith('/courses/'));
  const exactMatch = to === '/dashboard' ? location.pathname === to : isActive;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all ${
        exactMatch
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      <Icon size={18} className={exactMatch ? 'text-white' : 'text-slate-400'} />
      <span className="text-sm">{label}</span>
    </Link>
  );
}

function Sidebar({ open }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <aside
      style={{ width: open ? 260 : 0 }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col bg-white border-r border-slate-200 overflow-hidden transition-all duration-300 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.05)]"
    >
      <div
        className="flex items-center gap-3 px-6 h-20 border-b border-slate-100 flex-shrink-0 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
          <Icons.Code size={16} className="text-white" />
        </div>
        <span className="font-display font-bold text-xl text-slate-900 tracking-tight">SkillForge</span>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 flex flex-col">
        {MAIN_LINKS.map(item => <NavItem key={item.to} {...item} />)}

        <div className="flex-1" />

        <div className="pt-4 border-t border-slate-100 flex flex-col gap-1.5">
          {BOTTOM_LINKS.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <item.Icon size={16} className="text-slate-400" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
          
          {user && (
            <Link to="/profile" className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 hover:bg-slate-100 transition-all group">
              <Avatar user={user} size={36} className="ring-2 ring-white shadow-sm transition-transform group-hover:scale-105" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user.username || user.name}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">View Profile</p>
              </div>
              <Icons.ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500" />
            </Link>
          )}
        </div>
      </nav>
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
    const id = setInterval(fetchNotifs, 10000);
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

  return (
    <header
      style={{ left: sidebarOpen ? 260 : 0 }}
      className="fixed top-0 right-0 z-30 h-20 flex items-center justify-between px-8 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-slate-400 hover:text-slate-900 transition-colors p-1 md:hidden">
          <Icons.Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/courses" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Catalog</Link>
          {user && <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">My Learning</Link>}
          {user && <Link to="/settings" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Settings</Link>}
        </nav>

        {user ? (
          <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(v => !v); if (!notifOpen) fetchNotifs(); }}
                className="relative text-slate-400 hover:text-slate-700 transition-colors"
              >
                <Icons.Bell size={20} />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">
                    {unread}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-10 w-80 bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-50">
                  <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                    <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                    {unread > 0 && (
                      <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifs.length === 0 ? (
                      <p className="px-4 py-8 text-center text-sm text-slate-400">No notifications yet</p>
                    ) : notifs.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`px-4 py-3 border-b border-slate-50 last:border-0 cursor-pointer transition-colors ${n.read ? 'hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50'}`}
                      >
                        <div className="flex items-start gap-2">
                          {!n.read && <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />}
                          <div className={!n.read ? '' : 'pl-4'}>
                            <p className="text-sm font-semibold text-slate-900">{n.title || 'Notification'}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{n.body || n.message || ''}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3">Log In</button>
            <button onClick={() => navigate('/register')} className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors">Sign Up</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default function AppLayout() {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar open={sidebarOpen} />
      <Topbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        style={{ marginLeft: sidebarOpen ? 260 : 0 }}
        className="transition-all duration-300 pt-20 min-h-screen"
      >
        <div className="p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

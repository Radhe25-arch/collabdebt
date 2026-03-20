import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '@/store';
import { Avatar } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';

const MAIN_LINKS = [
  { to: '/dashboard',   label: 'Home',         Icon: Icons.Home },
  { to: '/courses',     label: 'Catalog',      Icon: Icons.Book },
  { to: '/tournaments', label: 'Tournaments',  Icon: Icons.Trophy },
  { to: '/battles',     label: '1v1 Arena',    Icon: Icons.Zap },
  { to: '/community',   label: 'Community',    Icon: Icons.Users },
  { to: '/mentor',      label: 'AI Mentor',    Icon: Icons.Terminal },
  { to: '/friends',     label: 'Friends',      Icon: Icons.MessageSquare },
];

const BOTTOM_LINKS = [
  { to: '/support', label: 'Support', Icon: Icons.Globe },
  { to: '/privacy', label: 'Privacy', Icon: Icons.Shield },
];

function NavItem({ to, label, Icon }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to) && (to !== '/courses' || location.pathname === '/courses' || location.pathname.startsWith('/courses/'));
  // strict match for dashboard to avoid matching everything
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
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-20 border-b border-slate-100 flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
          <Icons.Code size={16} className="text-white" />
        </div>
        <span className="font-display font-bold text-xl text-slate-900 tracking-tight">CodeArena</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 flex flex-col">
        {MAIN_LINKS.map(item => <NavItem key={item.to} {...item} />)}

        <div className="flex-1" />

        <div className="pt-4 border-t border-slate-100 flex flex-col gap-1.5">
          {BOTTOM_LINKS.map(item => (
            <Link key={item.to} to={item.to} className="flex items-center gap-3 px-4 py-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
              <item.Icon size={16} className="text-slate-400" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
          
          <button onClick={() => navigate('/courses')} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium text-sm transition-all shadow-sm">
            Start Learning
          </button>
        </div>
      </nav>
    </aside>
  );
}

function Topbar({ sidebarOpen, toggleSidebar }) {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = notifs.filter(n => !n.read).length;

  useEffect(() => {
    if (!user) return;
    const fetchNotifs = () => api.get('/notifications').then(r => setNotifs(r.data.notifications || [])).catch(() => {});
    fetchNotifs();
    const id = setInterval(fetchNotifs, 10000);
    return () => clearInterval(id);
  }, [user]);

  return (
    <header
      style={{ left: sidebarOpen ? 260 : 0 }}
      className="fixed top-0 right-0 z-30 h-20 flex items-center justify-between px-8 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all duration-300"
    >
      <div className="flex items-center gap-4 flex-1">
        <button onClick={toggleSidebar} className="text-slate-400 hover:text-slate-900 transition-colors p-1 md:hidden">
          <Icons.Menu size={20} />
        </button>
        
        {/* Search Bar - Center aligned ideally, but placed here for structure */}
        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2.5 w-full max-w-md border border-slate-200/50 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Icons.Search size={16} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search for courses, skills, or mentors..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/courses" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Catalog</Link>
          {user && <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">My Learning</Link>}
          {user && <Link to="/settings" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Settings</Link>}
        </nav>

        {user ? (
          <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
            <div className="relative">
              <button onClick={() => setNotifOpen(v => !v)} className="relative text-slate-400 hover:text-slate-700 transition-colors">
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
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifs.length === 0 ? (
                      <p className="px-4 py-8 text-center text-sm text-slate-400">No new notifications</p>
                    ) : notifs.map(n => (
                      <div key={n.id} className="px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                        <p className="text-sm font-medium text-slate-900">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{n.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/profile">
              <Avatar user={user} size={36} className="ring-2 ring-slate-100 hover:ring-blue-200 transition-all cursor-pointer" />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="block text-sm font-medium text-slate-600 hover:text-slate-900 px-3">Log In</button>
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
        className="transition-all duration-300 pt-20 min-h-screen flex flex-col"
      >
        <div className="p-8 max-w-7xl mx-auto flex-1 w-full">
          <Outlet />
        </div>
        <footer className="mt-auto border-t border-slate-200 py-8 px-8 bg-white/50 backdrop-blur text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Icons.Code size={14} className="text-slate-400" />
            <span className="font-display font-bold text-slate-900 tracking-tight">CodeArena Platform</span>
            <span className="text-slate-400 ml-2">© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link to="/support" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            <Link to="/mentor" className="hover:text-blue-600 transition-colors flex items-center gap-1"><Icons.Zap size={14} /> AI Support</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

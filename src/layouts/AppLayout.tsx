import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Swords,
  Target,
  MessageSquare,
  Users,
  User,
  Settings,
  Bell,
  Search,
  Cloud,
  ChevronLeft,
  ChevronRight,
  Zap,
  Command,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',   path: '/app',             group: 'main' },
  { icon: BookOpen,        label: 'Courses',      path: '/app/courses',     group: 'main' },
  { icon: Cloud,           label: 'Workspaces',   path: '/app/workspaces',  group: 'main' },
  { icon: MessageSquare,   label: 'AI Mentor',    path: '/app/mentor',      group: 'main' },
  { icon: Swords,          label: 'Battles',      path: '/app/battles',     group: 'compete' },
  { icon: Target,          label: 'Tournaments',  path: '/app/tournaments', group: 'compete' },
  { icon: Trophy,          label: 'Leaderboard',  path: '/app/leaderboard', group: 'compete' },
  { icon: Target,          label: 'Quests',       path: '/app/quests',      group: 'compete' },
  { icon: Users,           label: 'Forum',        path: '/app/forum',       group: 'community' },
];

const bottomNavItems = [
  { icon: User,     label: 'Profile',  path: '/app/profile'  },
  { icon: Settings, label: 'Settings', path: '/app/settings' },
];

const XP_CURRENT = 12450;
const XP_NEXT    = 15000;
const XP_PCT     = Math.round((XP_CURRENT / XP_NEXT) * 100);

export function AppLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(v => !v);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  const grouped = {
    main:      navItems.filter(n => n.group === 'main'),
    compete:   navItems.filter(n => n.group === 'compete'),
    community: navItems.filter(n => n.group === 'community'),
  };

  const sidebarW = collapsed ? 64 : 240;

  return (
    <div className="min-h-screen flex" style={{ background: '#030303' }}>

      {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: sidebarW }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-30 flex flex-col overflow-hidden"
        style={{
          width: sidebarW,
          background: 'rgba(8,8,8,0.95)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Logo row */}
        <div className="h-16 flex items-center justify-between px-4 flex-shrink-0"
             style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                <Link to="/">
                  <Logo />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setCollapsed(v => !v)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors ml-auto flex-shrink-0"
            style={{ color: '#737373' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav groups */}
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          {([
            { label: 'Platform',   items: grouped.main },
            { label: 'Compete',    items: grouped.compete },
            { label: 'Community',  items: grouped.community },
          ] as const).map(({ label, items }) => (
            <div key={label}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: '#404040', fontFamily: 'Geist Mono, monospace' }}
                  >
                    {label}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive = location.pathname === item.path ||
                    (item.path !== '/app' && location.pathname.startsWith(item.path));
                  return (
                    <Link key={item.path} to={item.path}>
                      <SidebarItem
                        icon={item.icon}
                        label={item.label}
                        isActive={isActive}
                        collapsed={collapsed}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* XP Bar + Bottom Items */}
        <div className="flex-shrink-0 px-2 pb-4 space-y-0.5"
             style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
          {/* XP Strip */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mx-1 mb-3 p-3 rounded-lg"
                style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold" style={{ color: '#a5b4fc' }}>Level 42</span>
                  <span className="text-[10px]" style={{ color: '#6366f1', fontFamily: 'Geist Mono, monospace' }}>
                    {XP_CURRENT.toLocaleString()} / {XP_NEXT.toLocaleString()} XP
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(99,102,241,0.15)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${XP_PCT}%` }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                    style={{ background: 'linear-gradient(90deg, #6366f1, #818cf8)' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <SidebarItem icon={item.icon} label={item.label} isActive={isActive} collapsed={collapsed} />
              </Link>
            );
          })}
        </div>
      </motion.aside>

      {/* ── MAIN AREA ─────────────────────────────────────────────────── */}
      <motion.div
        animate={{ marginLeft: sidebarW }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ marginLeft: sidebarW, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        {/* TOPBAR */}
        <header
          className="h-14 flex items-center justify-between px-6 sticky top-0 z-20 flex-shrink-0"
          style={{
            background: 'rgba(3,3,3,0.85)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-3 px-3 h-8 rounded-lg transition-colors text-sm"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#737373',
              minWidth: '200px',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
          >
            <Search size={13} />
            <span className="text-xs flex-1 text-left">Search...</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded"
                 style={{ background: 'rgba(255,255,255,0.06)', color: '#525252', fontFamily: 'Geist Mono, monospace' }}>
              ⌘K
            </kbd>
          </button>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            {/* Streak badge */}
            <div
              className="flex items-center gap-1.5 px-2.5 h-7 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)', color: '#fb923c' }}
            >
              <Zap size={11} fill="currentColor" />
              14 day streak
            </div>
            {/* Notification */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors relative"
                style={{ color: '#737373' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = '#f5f5f5';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#737373';
                }}
              >
                <Bell size={16} />
                <span
                  className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full animate-pulse-glow"
                  style={{ background: '#6366f1' }}
                />
              </button>
            </div>
            {/* Avatar */}
            <div className="h-7 w-7 rounded-full overflow-hidden flex-shrink-0"
                 style={{ border: '1.5px solid rgba(99,102,241,0.4)' }}>
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=1a1a2e" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </motion.div>

      {/* ── COMMAND PALETTE ───────────────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-xl rounded-xl overflow-hidden"
              style={{
                background: 'rgba(12,12,12,0.98)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4"
                   style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Search size={16} style={{ color: '#6366f1' }} />
                <input
                  ref={searchRef}
                  className="flex-1 py-4 bg-transparent text-sm outline-none placeholder:text-[#404040]"
                  style={{ color: '#f5f5f5', fontFamily: 'Inter, sans-serif' }}
                  placeholder="Search courses, users, or domains..."
                />
                <button onClick={() => setSearchOpen(false)}
                        className="text-xs px-2 py-1 rounded"
                        style={{ color: '#737373' }}>
                  ESC
                </button>
              </div>
              <div className="p-3">
                {['Dashboard', 'Courses', 'AI Mentor', 'Battles', 'Leaderboard'].map((item, i) => (
                  <button
                    key={item}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors"
                    style={{ color: '#a3a3a3' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.color = '#f5f5f5';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#a3a3a3';
                    }}
                    onClick={() => setSearchOpen(false)}
                  >
                    <Command size={13} style={{ color: '#6366f1', opacity: 0.7 }} />
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────── SIDEBAR ITEM ────────────────────────────── */
function SidebarItem({
  icon: Icon,
  label,
  isActive,
  collapsed,
}: {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  collapsed: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 px-3 h-9 rounded-lg cursor-pointer select-none relative nav-pill"
      title={collapsed ? label : undefined}
      style={{
        background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
        color: isActive ? '#818cf8' : '#737373',
        fontWeight: isActive ? 500 : 400,
        fontSize: '13px',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          e.currentTarget.style.color = '#e5e5e5';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#737373';
        }
      }}
    >
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
          style={{ background: '#6366f1' }}
        />
      )}
      <Icon size={16} className="flex-shrink-0" />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

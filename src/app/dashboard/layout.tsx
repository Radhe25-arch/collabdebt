'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, AlertTriangle, BarChart3, Zap, Users, GitBranch,
  CreditCard, Settings, Bell, Search, Plus, ChevronDown,
  LogOut, User, Menu, X, Crown, Users2, Terminal as TerminalIcon
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DataProvider } from '@/providers/DataProvider'
import { useStore } from '@/store/useStore'

const HEALTH_COLOR = (s: number) => s > 70 ? 'var(--green)' : s > 40 ? 'var(--yellow)' : 'var(--red)'

function getInitials(name: string | undefined) {
  if (!name) return '??'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const supabase = createClient()
  const { currentUser, isAdmin, repos, debtItems } = useStore()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const openCount = debtItems.filter(d => d.status !== 'fixed').length

  const nav_main = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/editor', label: 'Workspace', icon: TerminalIcon },
    { href: '/dashboard/debt-board', label: 'Debt Board', icon: AlertTriangle, badge: openCount || undefined },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/sprints', label: 'Sprints', icon: Zap },
    { href: '/dashboard/collab', label: 'CollabConnect', icon: Users2 },
  ]

  const nav_workspace = [
    { href: '/dashboard/team', label: 'Team', icon: Users },
    { href: '/dashboard/repos', label: 'Repositories', icon: GitBranch },
    { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const isManager = currentUser?.role === 'manager' || isAdmin()

  const pageTitle = pathname === '/dashboard'
    ? 'Overview'
    : pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--blue)', color: '#fff' }}
          >
            CD
          </div>
          <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>CollabDebt</span>
        </Link>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
        <div className="mb-4">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-dim)' }}>
            Main
          </p>
          {nav_main.map(item => (
            <Link key={item.href} href={item.href}
              className={`sidebar-link ${pathname === item.href ? 'active-premium' : ''}`}>
              <item.icon size={15} />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}
          {isManager && (
            <Link href="/dashboard/manager"
              className={`sidebar-link ${pathname === '/dashboard/manager' ? 'active-premium' : ''}`}>
              <Crown size={15} />
              <span>Manager View</span>
            </Link>
          )}
        </div>

        <div className="mb-4">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-dim)' }}>
            Workspace
          </p>
          {nav_workspace.map(item => (
            <Link key={item.href} href={item.href}
              className={`sidebar-link ${pathname === item.href ? 'active-premium' : ''}`}>
              <item.icon size={15} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {repos.length > 0 && (
          <div>
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-dim)' }}>
              Repositories
            </p>
            {repos.slice(0, 5).map(repo => (
              <Link key={repo.id} href="/dashboard/repos"
                className="sidebar-link">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: HEALTH_COLOR(repo.health_score) }} />
                <span className="flex-1 truncate">{repo.name}</span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-dim)' }}>{repo.health_score}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* User area */}
      <div className="px-2 py-3 border-t relative" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors text-left"
        >
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            {currentUser?.name ? getInitials(currentUser.name) : <User size={13} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>
              {currentUser?.name || 'Authorized User'}
            </div>
            <div className="text-[10px] truncate" style={{ color: 'var(--text-dim)' }}>
              {currentUser?.email || 'No session'}
            </div>
          </div>
          <ChevronDown size={12} style={{ color: 'var(--text-dim)' }} />
        </button>

        {userMenuOpen && (
          <div
            className="absolute bottom-full left-2 right-2 mb-1 rounded-md overflow-hidden z-50 shadow-xl"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <div className="px-3 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{currentUser?.name}</div>
              <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{currentUser?.email}</div>
              {isAdmin() && <div className="mt-1 badge badge-cyan">Admin</div>}
            </div>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium hover:bg-[var(--bg-tertiary)] transition-colors"
              style={{ color: 'var(--red)' }}
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <DataProvider>
      <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

        {/* Sidebar – desktop */}
        <aside
          className="hidden md:flex flex-col w-56 shrink-0 border-r"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          <Sidebar />
        </aside>

        {/* Mobile menu button */}
        <div className="md:hidden fixed top-4 left-4 z-[200]">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="btn-ghost w-9 h-9 p-0 flex items-center justify-center"
          >
            {mobileSidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Mobile sidebar */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-[150]" onClick={() => setMobileSidebarOpen(false)}>
            <div
              className="absolute inset-y-0 left-0 w-56 flex flex-col border-r"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
              onClick={e => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

          {/* Topbar */}
          <header
            className="h-12 flex items-center px-6 gap-4 shrink-0 border-b"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
          >
            <h1 className="text-sm font-semibold capitalize" style={{ color: 'var(--text)' }}>
              {pageTitle}
            </h1>

            <div className="flex-1 max-w-xs relative hidden lg:block">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
              <input
                className="input py-1.5 pl-8 pr-3 text-xs"
                placeholder="Search debt items, repos..."
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button className="btn-ghost py-1.5 px-2.5 relative" style={{ color: 'var(--text-muted)' }}>
                <Bell size={15} />
                {openCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--red)' }} />
                )}
              </button>
              <Link href="/dashboard/debt-board" className="btn-primary py-1.5 px-3 text-xs">
                <Plus size={13} />
                New Item
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </DataProvider>
  )
}

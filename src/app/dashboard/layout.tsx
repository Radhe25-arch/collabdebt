'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, AlertTriangle, BarChart3, Zap, Users, GitBranch,
  CreditCard, Settings, Bell, Search, Plus, HelpCircle, ChevronDown,
  LogOut, User, Menu, X, Crown, Code2, GitPullRequest, UserSearch, Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { MOCK_REPOS } from '@/lib/mock-data'
import OnboardingGuide from '@/components/onboarding/OnboardingGuide'
import type { User as AppUser } from '@/types'

const NAV_MAIN = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/debt-board', label: 'Debt Board', icon: AlertTriangle, badge: 7 },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/sprints', label: 'Sprints', icon: Zap },
]

const NAV_WORKSPACE = [
  { href: '/dashboard/team', label: 'Team', icon: Users },
  { href: '/dashboard/repos', label: 'Repositories', icon: GitBranch },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const HEALTH_COLOR = (s: number) => s > 70 ? '#00ff88' : s > 40 ? '#ffd600' : '#ff3b5c'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  // Load real user from Supabase
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setAppUser(data as AppUser)
        setShowOnboarding(!data.onboarding_done)
      }
      setLoadingUser(false)
    }
    loadUser()
  }, [supabase, router])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isPremium = appUser?.plan === 'pro' || appUser?.plan === 'team' || appUser?.plan === 'enterprise'
  const isManager = appUser?.role === 'manager'
  const initials = appUser?.name?.split(' ').map(n => n[0]).join('') || '??'

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <Link href="/dashboard" className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0"
            style={{ background: 'var(--cyan)', color: 'var(--bg)' }}>CD</div>
          {sidebarOpen && <span className="font-display font-bold text-base">CollabDebt</span>}
        </Link>
        {sidebarOpen && (
          <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <span className="font-medium truncate">My Workspace</span>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="mb-4">
          {sidebarOpen && <p className="px-3 text-[10px] uppercase tracking-widest mb-2 font-semibold" style={{ color: 'var(--text-dim)' }}>Main</p>}
          {NAV_MAIN.map(item => (
            <Link key={item.href} href={item.href}
              className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}>
              <item.icon size={18} />
              {sidebarOpen && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold"
                      style={{ background: 'rgba(255,59,92,0.2)', color: 'var(--red)' }}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}
          {isManager && (
            <Link href="/dashboard/manager"
              className={`sidebar-link ${pathname === '/dashboard/manager' ? 'active' : ''}`}>
              <Crown size={18} />
              {sidebarOpen && <span className="flex-1">Manager View</span>}
              {sidebarOpen && <span className="badge-cyan text-[9px] px-1">MGR</span>}
            </Link>
          )}
          <Link href="/dashboard/editor"
            className={`sidebar-link ${pathname === '/dashboard/editor' ? 'active' : ''}`}>
            <Code2 size={18} />
            {sidebarOpen && <span className="flex-1">Code Editor</span>}
          </Link>
        </div>

        {/* CollabConnect — premium feature */}
        <div className="mb-4">
          {sidebarOpen && (
            <p className="px-3 text-[10px] uppercase tracking-widest mb-2 font-semibold"
              style={{ color: 'var(--text-dim)' }}>Connect</p>
          )}
          <Link href="/dashboard/connect"
            className={`sidebar-link ${pathname === '/dashboard/connect' ? 'active' : ''}`}>
            <UserSearch size={18} />
            {sidebarOpen && (
              <>
                <span className="flex-1">CollabConnect™</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5"
                  style={isPremium
                    ? { background: 'rgba(0,229,255,0.15)', color: 'var(--cyan)', border: '1px solid rgba(0,229,255,0.3)' }
                    : { background: 'rgba(168,85,247,0.15)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)' }}>
                  {isPremium ? 'PRO' : '🔒'}
                </span>
              </>
            )}
          </Link>
        </div>

        {/* Workspace */}
        <div className="mb-4">
          {sidebarOpen && <p className="px-3 text-[10px] uppercase tracking-widest mb-2 font-semibold" style={{ color: 'var(--text-dim)' }}>Workspace</p>}
          {NAV_WORKSPACE.map(item => (
            <Link key={item.href} href={item.href}
              className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}>
              <item.icon size={18} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* Repos */}
        {sidebarOpen && (
          <div>
            <p className="px-3 text-[10px] uppercase tracking-widest mb-2 font-semibold" style={{ color: 'var(--text-dim)' }}>Repositories</p>
            {MOCK_REPOS.map(repo => (
              <Link key={repo.id} href="/dashboard/repos" className="sidebar-link group">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: HEALTH_COLOR(repo.health_score) }} />
                <span className="flex-1 truncate text-xs">{repo.name}</span>
                <span className="text-[10px] font-mono" style={{ color: HEALTH_COLOR(repo.health_score) }}>{repo.health_score}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Plan badge + user */}
      <div className="p-3 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
        {sidebarOpen && appUser && (
          <div className="px-3 py-2 rounded-lg text-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold capitalize" style={{ color: 'var(--cyan)' }}>
                {appUser.plan} Plan
              </span>
              <Link href="/dashboard/billing" className="text-[10px] underline" style={{ color: 'var(--text-muted)' }}>
                {isPremium ? 'Manage' : 'Upgrade'}
              </Link>
            </div>
            {!isPremium && (
              <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                Upgrade for CollabConnect™ & more
              </p>
            )}
          </div>
        )}

        <div className="relative">
          <button onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all"
            style={userMenuOpen ? { background: 'var(--surface)' } : {}}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: 'rgba(0,229,255,0.15)', color: 'var(--cyan)' }}>
              {loadingUser ? <Loader2 size={12} className="animate-spin" /> : initials}
            </div>
            {sidebarOpen && appUser && (
              <>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-xs font-semibold truncate">{appUser.name}</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{appUser.user_code}</div>
                </div>
                <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
              </>
            )}
          </button>
          {userMenuOpen && sidebarOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1 rounded-xl overflow-hidden shadow-xl z-50"
              style={{ background: 'var(--card)', border: '1px solid var(--border-bright)' }}>
              <Link href="/dashboard/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors">
                <User size={14} style={{ color: 'var(--text-muted)' }} /> Settings
              </Link>
              <button onClick={signOut} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors"
                style={{ color: 'var(--red)' }}>
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      {showOnboarding && <OnboardingGuide onComplete={() => setShowOnboarding(false)} />}

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col transition-all duration-200 shrink-0 border-r ${sidebarOpen ? 'w-60' : 'w-16'}`}
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <SidebarContent />
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-0 bottom-20 translate-x-full -mr-3 w-5 h-10 rounded-r-lg border-y border-r items-center justify-center hidden md:flex"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          {sidebarOpen ? '‹' : '›'}
        </button>
      </aside>

      {/* Mobile sidebar */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 h-full" style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 border-b flex items-center px-4 gap-4 shrink-0"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <button onClick={() => setMobileSidebarOpen(true)} className="md:hidden p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}>
            <Menu size={18} />
          </button>

          <div className="font-display font-semibold text-sm hidden sm:block capitalize">
            {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
          </div>

          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
            <input className="input pl-9 py-1.5 text-sm" placeholder="Search debt items, files, users..." />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: 'var(--text-muted)' }}
              title="Trigger scan">
              <GitPullRequest size={17} />
            </button>

            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-lg transition-colors hover:bg-white/5 relative"
                style={{ color: 'var(--text-muted)' }}>
                <Bell size={17} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--red)' }} />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-1 w-80 rounded-xl shadow-xl z-50 overflow-hidden"
                  style={{ background: 'var(--card)', border: '1px solid var(--border-bright)' }}>
                  <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                    <span className="font-semibold text-sm">Notifications</span>
                    <button onClick={() => setNotifOpen(false)}><X size={14} style={{ color: 'var(--text-muted)' }} /></button>
                  </div>
                  {[
                    { title: 'Critical debt found', body: 'Token race condition in api-server', time: '2m ago', type: 'critical' },
                    { title: 'Sprint 14 ending soon', body: '2 items still in progress', time: '1h ago', type: 'sprint' },
                    { title: 'Priya fixed debt item', body: 'Hardcoded API key removed', time: '3h ago', type: 'fixed' },
                  ].map((n, i) => (
                    <div key={i} className="px-4 py-3 border-b hover:bg-white/5 cursor-pointer flex gap-3" style={{ borderColor: 'var(--border)' }}>
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ background: n.type === 'critical' ? 'var(--red)' : n.type === 'fixed' ? 'var(--green)' : 'var(--cyan)' }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{n.title}</div>
                        <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{n.body}</div>
                      </div>
                      <div className="text-xs shrink-0" style={{ color: 'var(--text-dim)' }}>{n.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <a href="https://support.collabdebt.com" target="_blank" rel="noopener"
              className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
              <HelpCircle size={17} />
            </a>

            <Link href="/dashboard/debt-board" className="btn-primary text-xs py-1.5 px-3 hidden sm:flex">
              <Plus size={14} /> Add Debt
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

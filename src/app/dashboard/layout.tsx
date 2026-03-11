'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, AlertTriangle, BarChart3, Zap, Users, GitBranch,
  CreditCard, Settings, Bell, Search, Plus, HelpCircle, ChevronDown,
  LogOut, User, Menu, X, Crown, Code2, GitPullRequest, Loader2,
  Sparkles, MousePointer2, Briefcase, Globe
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DataProvider } from '@/providers/DataProvider'
import { useStore } from '@/store/useStore'
import type { User as AppUser } from '@/types'

const HEALTH_COLOR = (s: number) => s > 70 ? '#00f2ff' : s > 40 ? '#ffd600' : '#ff3b5c'

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const supabase = createClient()
  const { currentUser, isAdmin, repos, debtItems } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const nav_main = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/debt-board', label: 'Debt Space', icon: AlertTriangle, badge: debtItems.filter(d => d.status !== 'fixed').length },
    { href: '/dashboard/analytics', label: 'Neural Scan', icon: BarChart3 },
    { href: '/dashboard/sprints', label: 'Orbits', icon: Zap },
  ]

  const nav_workspace = [
    { href: '/dashboard/team', label: 'Fleet', icon: Users },
    { href: '/dashboard/repos', label: 'Cores', icon: GitBranch },
    { href: '/dashboard/billing', label: 'Fuel', icon: CreditCard },
    { href: '/dashboard/settings', label: 'Ship Config', icon: Settings },
  ]

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const isManager = currentUser?.role === 'manager' || isAdmin()

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6">
      {/* Logo Area */}
      <div className="px-6 mb-8 group cursor-pointer" onClick={() => window.location.href = '/dashboard'}>
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-10 h-10 rounded-xl glass border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
          >
            CD
          </motion.div>
          {sidebarOpen && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-display font-bold text-lg tracking-tight text-white"
            >
              CollabDebt
            </motion.span>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="mb-8">
          {sidebarOpen && <p className="px-5 text-[10px] uppercase tracking-[0.2em] mb-4 font-bold text-slate-500">Navigation</p>}
          {nav_main.map(item => (
            <Link key={item.href} href={item.href}
              className={`sidebar-link group transition-all duration-300 ${pathname === item.href ? 'active-premium' : ''}`}>
              <item.icon size={20} className={`transition-colors ${pathname === item.href ? 'text-cyan-400' : 'text-slate-400 group-hover:text-white'}`} />
              {sidebarOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center flex-1 ml-3 font-semibold text-sm">
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className="badge-cyan text-[10px] px-2 py-0.5 animate-pulse">
                      {item.badge}
                    </span>
                  ) : null}
                </motion.div>
              )}
            </Link>
          ))}
          {isManager && (
            <Link href="/dashboard/manager"
              className={`sidebar-link group transition-all duration-300 ${pathname === '/dashboard/manager' ? 'active-premium' : ''}`}>
              <Crown size={20} className={`${pathname === '/dashboard/manager' ? 'text-cyan-400' : 'text-slate-400'}`} />
              {sidebarOpen && <span className="flex-1 ml-3 font-semibold text-sm">Command View</span>}
            </Link>
          )}
        </div>

        <div className="mb-8">
          {sidebarOpen && <p className="px-5 text-[10px] uppercase tracking-[0.2em] mb-4 font-bold text-slate-500">Workspace</p>}
          {nav_workspace.map(item => (
            <Link key={item.href} href={item.href}
              className={`sidebar-link group ${pathname === item.href ? 'active-premium' : ''}`}>
              <item.icon size={20} className={`${pathname === item.href ? 'text-cyan-400' : 'text-slate-400'}`} />
              {sidebarOpen && <span className="ml-3 font-semibold text-sm">{item.label}</span>}
            </Link>
          ))}
        </div>

        {sidebarOpen && (
          <div>
            <p className="px-5 text-[10px] uppercase tracking-[0.2em] mb-4 font-bold text-slate-500">Live Cores</p>
            {repos.map(repo => (
              <Link key={repo.id} href="/dashboard/repos" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 mx-1 rounded-xl group transition-all">
                <div className="w-2 h-2 rounded-full shrink-0 animate-glow" style={{ background: HEALTH_COLOR(repo.health_score) }} />
                <span className="flex-1 truncate text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{repo.name}</span>
                <span className="text-[10px] font-mono font-bold" style={{ color: HEALTH_COLOR(repo.health_score) }}>{repo.health_score}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* User Logic */}
      <div className="mt-auto px-3 border-t border-white/5 pt-6">
        <div className="relative">
          <motion.button 
            whileHover={{ y: -2 }}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full glass-card p-3 flex items-center gap-3 group transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl glass border-cyan-500/20 flex items-center justify-center text-xs font-bold shrink-0 text-cyan-400 bg-cyan-400/5 group-hover:scale-110 transition-transform">
              {currentUser ? getInitials(currentUser.name) : <User size={18} />}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">{currentUser?.name || 'Commander'}</div>
                <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase truncate">
                  {isAdmin() ? 'Super Admin' : currentUser?.role || 'Officer'}
                </div>
              </div>
            )}
            {sidebarOpen && <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />}
          </motion.button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 right-0 mb-3 glass rounded-2xl overflow-hidden shadow-2xl z-50 border-white/10"
              >
                <div className="p-4 border-b border-white/5">
                  <div className="text-sm font-bold text-white">{currentUser?.name}</div>
                  <div className="text-xs text-slate-400">{currentUser?.email}</div>
                  {isAdmin() && <div className="mt-2 badge-cyan inline-block text-[9px] px-2 py-0.5">Admin Privileges Active</div>}
                </div>
                <button 
                   onClick={signOut}
                   className="w-full flex items-center gap-3 p-4 text-sm font-bold text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <LogOut size={16} /> Abort Mission
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )

  return (
    <DataProvider>
      <div className="flex h-screen overflow-hidden bg-[#020609] selection:bg-cyan-500/30">
        
        {/* Spatial Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full" />
          <div className="absolute inset-0 bg-dot-grid opacity-20" />
        </div>

        {/* Desktop Sidebar */}
        <aside 
          className={`hidden md:flex flex-col transition-all duration-500 shrink-0 relative z-[100] m-4 mr-0 rounded-[32px] glass border-white/5 shadow-2xl ${sidebarOpen ? 'w-72' : 'w-24'}`}
        >
          <SidebarContent />
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-12 rounded-xl glass border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-xl"
          >
            {sidebarOpen ? '‹' : '›'}
          </button>
        </aside>

        {/* Mobile Toggle */}
        <div className="md:hidden fixed top-6 right-6 z-[200]">
          <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} className="glass-card w-12 h-12 flex items-center justify-center text-white">
            {mobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="md:hidden fixed inset-0 z-[150] w-72 m-4 rounded-[32px] glass border-white/5 shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
          
          <header className="h-20 flex items-center px-8 gap-6 shrink-0 relative z-50">
            <div className="flex-1 flex items-center gap-1.5">
               <h2 className="font-display font-black text-xl text-white uppercase tracking-[0.15em]">
                  {pathname.split('/').pop()?.replace('-', ' ') || 'Bridge'}
               </h2>
               <div className="badge-cyan text-[10px] px-2 py-0.5 rounded-md font-bold">Stable Orbit</div>
            </div>

            <div className="flex-1 max-w-lg relative hidden lg:block opacity-60 focus-within:opacity-100 transition-opacity">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input className="glass-card w-full pl-12 pr-4 py-3 text-sm font-medium focus:ring-1 focus:ring-cyan-500/50 outline-none placeholder:text-slate-600" placeholder="Scan records, cores, or fleet members..." />
            </div>

            <div className="flex items-center gap-4">
               <div className="flex -space-x-2 mr-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-300">
                       {['RV', 'AK', 'VN'][i]}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center bg-cyan-500/20 text-[10px] font-bold text-cyan-400">
                    +4
                  </div>
               </div>

               <button className="glass-card p-3 text-slate-400 hover:text-white transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(0,242,255,1)]" />
               </button>

               <Link href="/dashboard/debt-board" className="btn-primary group px-6 py-3 font-bold text-sm">
                  <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
                  <span className="hidden sm:inline">New Core Fix</span>
               </Link>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>

        </div>
      </div>
    </DataProvider>
  )
}

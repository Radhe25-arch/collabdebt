'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  GitBranch, 
  LayoutDashboard, 
  Settings, 
  Users, 
  Zap, 
  Shield, 
  Activity,
  Code2,
  Terminal,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

const NAVIGATION = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Debt Board', href: '/dashboard/debt-board', icon: Layers },
  { name: 'Repositories', href: '/dashboard/repos', icon: GitBranch },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Fleet', href: '/dashboard/team', icon: Users },
  { name: 'Sprints', href: '/dashboard/sprints', icon: Activity },
  { name: 'Manager', href: '/dashboard/manager', icon: Shield },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="relative flex flex-col h-screen bg-black border-r border-white/5 z-40 transition-all duration-300 ease-in-out"
    >
      {/* Mesh background element for Sidebar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-0 -left-20 w-40 h-40 bg-indigo-500/20 blur-[100px] rounded-full" />
      </div>

      <div className="flex items-center gap-3 p-6 mb-4 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] flex-shrink-0">
          <Zap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-black text-xl tracking-tighter text-white"
          >
            COLLABDEBT
          </motion.span>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 relative z-10 overflow-y-auto overflow-x-hidden">
        {NAVIGATION.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                active 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg' 
                  : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon size={20} className={active ? 'text-indigo-400' : 'group-hover:text-white transition-colors'} />
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-bold"
                >
                  {item.name}
                </motion.span>
              )}
              {active && !collapsed && (
                <motion.div layoutId="active-pill" className="ml-auto w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Status / Bottom Actions */}
      <div className="p-4 border-t border-white/5 relative z-10">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-zinc-600 hover:text-white hover:bg-white/5 transition-all"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </motion.aside>
  )
}

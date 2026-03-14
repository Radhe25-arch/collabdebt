'use client'

import { Bell, Search, Command, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-black tracking-tight text-white uppercase">{title}</h1>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-900 border border-white/5 text-[10px] font-black text-zinc-500">
           <Zap size={10} className="text-indigo-500" />
           NEURAL SCAN ACTIVE
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-white/5 text-zinc-500 hover:border-white/10 transition-all cursor-pointer">
          <Search size={16} />
          <span className="text-xs font-bold">Quick Search...</span>
          <div className="flex items-center gap-1 ml-4 px-1.5 py-0.5 rounded-md bg-black text-[10px] border border-white/5">
             <Command size={10} />
             K
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-black" />
          </button>
          
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 border border-white/10 cursor-pointer shadow-lg hover:scale-110 transition-transform" />
        </div>
      </div>
    </header>
  )
}

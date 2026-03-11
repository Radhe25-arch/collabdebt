'use client'

import { useState, useMemo } from 'react'
import { UserPlus, Search, MoreHorizontal, Crown, MessageSquare, UserCheck, X, Shield, Activity, Share2, Mail, Terminal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'

export default function TeamPage() {
  const { team } = useStore()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    return team.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.user_code.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [team, searchQuery])

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-[0.2em]">
            <Shield size={14} /> Fleet Security Division
          </div>
          <h1 className="text-4xl font-display font-black text-white tracking-tighter">Command <span className="text-gradient-purple">Fleet.</span></h1>
        </div>
        <div className="flex items-center gap-3">
           <div className="glass-card px-4 py-2 flex items-center gap-2 text-xs font-bold text-slate-400">
              <Activity size={14} className="text-purple-400" /> Active Ranks: {team.length}
           </div>
           <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={() => setInviteOpen(true)} 
             className="btn-primary-purple px-6 py-2.5 text-sm shadow-[0_0_20px_rgba(168,85,247,0.2)]"
           >
             <UserPlus size={16} /> Enlist Personnel
           </motion.button>
        </div>
      </div>

      {/* Control Module */}
      <div className="glass shadow-2xl p-4 rounded-[24px] flex flex-wrap items-center gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-purple-400/[0.02] pointer-events-none" />
        <div className="w-10 h-10 rounded-xl glass border-white/5 flex items-center justify-center text-slate-500">
           <Search size={18} />
        </div>
        <input 
          className="bg-transparent flex-1 min-w-[200px] px-2 text-sm font-bold text-white outline-none placeholder:text-slate-600 uppercase tracking-widest" 
          placeholder="Scan by identity or fleet code..."
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
        />
        <div className="flex gap-2">
           <button className="glass p-2 text-slate-500 hover:text-white transition-all"><Terminal size={16} /></button>
           <button className="glass p-2 text-slate-500 hover:text-white transition-all"><Share2 size={16} /></button>
        </div>
      </div>

      {/* Fleet Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((member, i) => (
            <motion.div 
              key={member.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card group p-6 relative overflow-hidden transition-all duration-500 hover:border-purple-500/30"
            >
              <div className="absolute top-0 right-0 p-4">
                 <div className={`w-2 h-2 rounded-full ${member.online ? 'bg-cyan-400 animate-glow shadow-[0_0_10px_rgba(0,242,255,1)]' : 'bg-slate-700'}`} />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl glass border-white/10 flex items-center justify-center relative shadow-xl transform group-hover:rotate-6 transition-transform">
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-[1px]" />
                  <span className="text-lg font-black text-white">{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-white truncate flex items-center gap-2 uppercase tracking-tight">
                    {member.name}
                    {member.role === 'manager' && <Crown size={12} className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" />}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">{member.role === 'manager' ? 'Command Officer' : 'Fleet Engineer'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass p-3 rounded-xl space-y-1">
                   <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none">Cores Fixed</p>
                   <p className="text-base font-black text-purple-400 leading-none">{member.items_fixed}</p>
                </div>
                <div className="glass p-3 rounded-xl space-y-1 text-right">
                   <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none">Fleet ID</p>
                   <p className="text-xs font-mono font-bold text-slate-400 truncate leading-none mt-1.5">{member.user_code}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <button className="flex-1 glass py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center justify-center gap-2">
                    <Mail size={12} /> Contact
                 </button>
                 <button className="glass w-10 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-white transition-all">
                    <MoreHorizontal size={14} />
                 </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pending Transmission */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/[0.03] to-transparent pointer-events-none" />
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-2">
           <Activity size={16} className="text-slate-500" /> Pending Transmission
        </h2>
        <div className="space-y-4">
          {[
            { email: 'commander_alpha@acme.space', rank: 'Captain', status: 'Warping...' },
            { email: 'officer_gamma@labs.io', rank: 'Navigator', status: 'En route' },
          ].map((inv, i) => (
            <div key={i} className="flex items-center justify-between p-4 glass rounded-2xl border-white/5 hover:border-purple-500/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg glass flex items-center justify-center"><Mail size={14} className="text-slate-500" /></div>
                <div>
                  <div className="text-xs font-black text-white uppercase tracking-tight">{inv.email}</div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Rank: {inv.rank} · Active Scan</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="badge-purple text-[8px] font-black uppercase tracking-widest animate-pulse px-3 py-1">{inv.status}</span>
                <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-600 hover:text-red-400 transition-colors"><X size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personnel Enlistment Modal */}
      <AnimatePresence>
        {inviteOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) setInviteOpen(false) }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="glass border-white/10 max-w-md w-full rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                 <X size={20} className="text-slate-600 cursor-pointer hover:text-white transition-colors" onClick={() => setInviteOpen(false)} />
              </div>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-[24px] glass border-purple-500/20 flex items-center justify-center mx-auto text-purple-400 mb-4 shadow-xl shadow-purple-500/10">
                   <UserPlus size={32} />
                </div>
                <h2 className="text-xl font-display font-black text-white uppercase tracking-tight line-clamp-1">Enlist Personnel</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Expansion Order 14</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Universal Address</label>
                  <input className="glass-card w-full p-4 text-sm font-bold bg-transparent outline-none focus:ring-1 focus:ring-purple-500/30 text-white placeholder:text-slate-700" type="email" placeholder="ENTITY_ID@DOMAIN.SPACE" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Command Rank</label>
                  <select className="glass-card w-full p-4 text-sm font-bold bg-transparent outline-none focus:ring-1 focus:ring-purple-500/30 text-white">
                    <option value="developer" className="bg-[#020609]">FLEET ENGINEER</option>
                    <option value="viewer" className="bg-[#020609]">FLEET OBSERVER</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary-purple flex-1 py-4 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-purple-500/20"
                  >
                    Authorize Enlistment
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  Search, 
  Plus, 
  Shield, 
  Mail, 
  MoreHorizontal, 
  Activity, 
  Code2, 
  Zap,
  CheckCircle2,
  Clock,
  UserPlus
} from 'lucide-react'

const TEAM_MEMBERS = [
  {
    id: '1',
    name: 'Alex Rivera',
    email: 'alex@collabdebt.dev',
    role: 'Lead Architect',
    status: 'online',
    resolved: 42,
    activeItems: 3,
    impact: 'High'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@collabdebt.dev',
    role: 'Backend Engineer',
    status: 'busy',
    resolved: 28,
    activeItems: 5,
    impact: 'Medium'
  },
  {
    id: '3',
    name: 'Mike Ross',
    email: 'mike@collabdebt.dev',
    role: 'Systems Engineer',
    status: 'offline',
    resolved: 15,
    activeItems: 0,
    impact: 'Low'
  },
  {
    id: '4',
    name: 'Elena Gilbert',
    email: 'elena@collabdebt.dev',
    role: 'Frontend Architect',
    status: 'online',
    resolved: 35,
    activeItems: 2,
    impact: 'High'
  }
]

export default function TeamPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-1 uppercase text-gradient-indigo">Fleet Intelligence</h2>
          <p className="text-zinc-500 font-medium text-sm">Monitoring {TEAM_MEMBERS.length} active service units in the field.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-500 text-white font-black text-sm hover:bg-indigo-600 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">
          <UserPlus size={18} />
          ENLIST SERVICE UNIT
        </button>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-[24px] bg-zinc-900/40 border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search service units by designation or role..."
            className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white font-bold text-sm outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAM_MEMBERS.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[40px] bg-zinc-900/40 border border-white/5 relative overflow-hidden group card-hover shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="p-2 rounded-lg bg-white/5 text-zinc-500 hover:text-white">
                  <MoreHorizontal size={18} />
               </button>
            </div>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-4">
                 <div className="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-zinc-800 to-zinc-700 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500/10 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center font-black text-3xl text-zinc-500">
                       {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                 </div>
                 <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-2xl border-4 border-black flex items-center justify-center ${
                   member.status === 'online' ? 'bg-emerald-500' : member.status === 'busy' ? 'bg-amber-500' : 'bg-zinc-600'
                 }`}>
                    {member.status === 'online' && <Activity size={14} className="text-white" />}
                    {member.status === 'busy' && <Clock size={14} className="text-white" />}
                 </div>
              </div>
              <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{member.name}</h3>
              <p className="text-xs font-black text-indigo-500 uppercase tracking-widest">{member.role}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
               <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                  <div className="text-lg font-black text-white">{member.resolved}</div>
                  <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">NEUTRALIZED</div>
               </div>
               <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                  <div className="text-lg font-black text-white">{member.activeItems}</div>
                  <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">ENGAGED</div>
               </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 pt-6 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                   <Shield size={12} className="text-indigo-500" />
                   IMPACT: <span className={member.impact === 'High' ? 'text-emerald-500' : 'text-zinc-400'}>{member.impact}</span>
                </div>
                <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                   <Mail size={12} />
                   UPLINK
                </button>
            </div>
          </motion.div>
        ))}

        {/* Invite Suggestion */}
        <div className="p-8 rounded-[40px] border border-white/5 border-dashed flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-zinc-900/20 transition-all min-h-[400px]">
           <div className="w-16 h-16 rounded-[24px] bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600 group-hover:scale-110 group-hover:text-indigo-400 transition-all mb-4 shadow-2xl">
              <Plus size={32} />
           </div>
           <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Extend Fleet</h3>
        </div>
      </div>
    </div>
  )
}

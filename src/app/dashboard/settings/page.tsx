'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Shield, 
  Key, 
  Bell, 
  Users, 
  Code2, 
  Terminal,
  Save,
  Trash2,
  Copy,
  Check,
  Zap,
  Globe,
  Settings
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [copied, setCopied] = useState(false)

  const handleCopyKey = () => {
    setCopied(true)
    navigator.clipboard.writeText('sk_collab_live_4920kzx81ns092m')
    toast.success('API Key copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-1 uppercase text-gradient-indigo">System Configuration</h2>
          <p className="text-zinc-500 font-medium text-sm">Manage your account identity and team authorizations.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-500 text-white font-black text-sm hover:bg-indigo-600 transition-all shadow-xl">
          <Save size={18} />
          SAVE CHANGES
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Nav Tabs */}
        <div className="w-full md:w-64 space-y-2">
          {[
            { id: 'profile', label: 'Identity', icon: User },
            { id: 'team', label: 'Fleet / Team', icon: Users },
            { id: 'api', label: 'Access Keys', icon: Key },
            { id: 'notifications', label: 'Telemetry', icon: Bell },
            { id: 'security', label: 'Shielding', icon: Shield },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border ${
                activeTab === tab.id 
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-lg' 
                  : 'text-zinc-500 border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 space-y-8">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="p-8 rounded-[40px] bg-zinc-900/40 border border-white/5 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-2xl" />
                    <button className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <Code2 size={24} className="text-white" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">System Uplink Initialized</h3>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest mt-1">Status: Active Service Unit</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Designation</label>
                    <input 
                      type="text" 
                      defaultValue="Alex Rivera"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 px-4 text-white font-bold text-sm focus:border-indigo-500/50 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Account ID (Email)</label>
                    <input 
                      type="email" 
                      defaultValue="alex@collabdebt.dev"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 px-4 text-white font-bold text-sm focus:border-indigo-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Bio / Unit Description</label>
                  <textarea 
                    defaultValue="Senior Systems Architect specializing in zero-debt infrastructure and automated code scanning."
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 px-4 text-white font-bold text-sm focus:border-indigo-500/50 outline-none transition-all h-24"
                  />
                </div>
              </div>

              <div className="p-8 rounded-[40px] bg-zinc-900/40 border border-white/5">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {['Rust', 'Go', 'Distributed Systems', 'K8s', 'Security Architecture', 'React'].map(tag => (
                    <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:border-indigo-500/30 hover:text-indigo-400 transition-all cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="p-8 rounded-[40px] bg-zinc-900/40 border border-white/5 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">Access Uplink Keys</h3>
                    <p className="text-xs text-zinc-500 font-medium">Used for programmatic access to the Intelligence API.</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-zinc-800 text-white font-black text-[10px] uppercase tracking-widest hover:bg-zinc-700 transition-all">Generate New Key</button>
                </div>

                <div className="space-y-4">
                   <div className="group p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between transition-all hover:border-indigo-500/30">
                      <div className="flex items-center gap-3">
                         <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                            <Key size={16} />
                         </div>
                         <div>
                            <div className="text-sm font-black text-white">sk_collab_live_492...</div>
                            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">Created: Jan 12, 2025</div>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <button 
                          onClick={handleCopyKey}
                          className="p-2 rounded-lg bg-zinc-800 text-zinc-500 hover:text-white transition-all"
                         >
                            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                         </button>
                         <button className="p-2 rounded-lg bg-zinc-800 text-zinc-500 hover:text-rose-500 transition-all">
                            <Trash2 size={16} />
                         </button>
                      </div>
                   </div>
                </div>

                <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                   <Shield className="text-amber-500 shrink-0 mt-1" size={20} />
                   <div>
                      <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">Key Security Protocol</h4>
                      <p className="text-[11px] text-amber-500/70 font-medium leading-relaxed">
                        Treat your secret keys as passwords. Never commit them to subversion or expose them in client-side code. If a key is compromised, revoke it immediately within this interface.
                      </p>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="p-8 rounded-[40px] bg-zinc-900/40 border border-white/5 space-y-6 animate-in slide-in-from-right-4 duration-300">
               <h3 className="text-lg font-black text-white uppercase tracking-tight">Telemetry Preferences</h3>
               <div className="space-y-4">
                  {[
                    { title: 'Critical Anomalies', desc: 'Alert when health falls below 40% strike threshold.', active: true },
                    { title: 'Fleet Sync', desc: 'Sync status updates from connected repositories.', active: true },
                    { title: 'ROI Summaries', desc: 'Weekly intelligence reports on refactor efficiency.', active: false },
                    { title: 'Team Comms', desc: 'Direct uplink messages from other service units.', active: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                       <div>
                          <div className="text-sm font-black text-white">{item.title}</div>
                          <div className="text-[10px] font-bold text-zinc-500">{item.desc}</div>
                       </div>
                       <div className={`w-12 h-6 rounded-full border border-white/10 relative cursor-pointer transition-all ${
                         item.active ? 'bg-indigo-500 border-indigo-400' : 'bg-zinc-800'
                       }`}>
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                            item.active ? 'left-6' : 'left-1'
                          }`} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

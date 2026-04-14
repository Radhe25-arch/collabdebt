import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Bell, Shield, Key, CreditCard, CheckCircle2, ChevronRight, Monitor, Github, Mail } from 'lucide-react';

const TABS = [
  { id: 'profile', icon: User, label: "Profile", desc: "Manage your public presence" },
  { id: 'account', icon: Shield, label: "Account", desc: "Security and authentication" },
  { id: 'notifications', icon: Bell, label: "Notifications", desc: "Configure your alerts" },
  { id: 'appearance', icon: Monitor, label: "Appearance", desc: "Theme and editor preferences" },
  { id: 'integrations', icon: Key, label: "Integrations", desc: "API keys and connected apps" },
  { id: 'billing', icon: CreditCard, label: "Billing", desc: "Subscription and invoices" },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-8 max-w-6xl mx-auto min-h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Settings</h1>
        <p className="text-zinc-500 mt-2 font-mono text-sm tracking-wide">Manage your preferences, security, and integrations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-10 flex-1">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-zinc-900 border border-zinc-800 shadow-sm' 
                    : 'border border-transparent hover:bg-zinc-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center rounded-lg w-8 h-8 transition-colors ${
                    isActive ? 'bg-indigo-500/10 text-indigo-400' : 'bg-transparent text-zinc-500 group-hover:text-zinc-300'
                  }`}>
                    <tab.icon size={16} />
                  </div>
                  <div className="text-left">
                    <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                      {tab.label}
                    </div>
                  </div>
                </div>
                {isActive && (
                  <motion.div layoutId="active-pill" className="w-1 h-4 bg-indigo-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {activeTab === 'profile' && (
                <>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 overflow-hidden">
                    <div className="p-6 border-b border-zinc-800/50">
                      <h2 className="text-lg font-display font-medium text-white mb-1">Public Profile</h2>
                      <p className="text-sm font-mono text-zinc-500">This is how others will see you on the platform.</p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                          </div>
                          <button className="absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-2 py-1 text-[10px] font-mono shadow-lg transition-colors border border-indigo-500/50">
                            Upload
                          </button>
                        </div>
                        <div className="text-sm font-mono text-zinc-500">
                          Recommended format: Square PG, PNG, or GIF. Max 5MB.
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-mono uppercase tracking-widest text-zinc-500">Display Name</label>
                          <Input 
                            defaultValue="Felix Developer" 
                            className="bg-black border-zinc-800 focus-visible:border-indigo-500 h-11 rounded-xl text-white placeholder:text-zinc-600 font-medium"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-mono uppercase tracking-widest text-zinc-500">Username</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-mono">skillforge.dev/</span>
                            <Input 
                              defaultValue="felix_dev" 
                              className="pl-[120px] bg-black border-zinc-800 focus-visible:border-indigo-500 h-11 rounded-xl text-white font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase tracking-widest text-zinc-500">Bio</label>
                        <textarea 
                          className="w-full bg-black border border-zinc-800 focus-visible:border-indigo-500 rounded-xl text-white px-4 py-3 min-h-[100px] resize-y outline-none transition-colors text-sm font-mono leading-relaxed"
                          defaultValue="Senior Systems Engineer. Learning Rust and Go. Building the future."
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-zinc-900 flex justify-end gap-3 border-t border-zinc-800/50">
                      <Button variant="ghost" className="text-zinc-400 hover:text-white font-mono rounded-xl hover:bg-zinc-800">Cancel</Button>
                      <Button className="bg-white text-black hover:bg-zinc-200 font-mono rounded-xl font-bold">Save Changes</Button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 overflow-hidden">
                    <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center">
                      <div>
                        <h2 className="text-lg font-display font-medium text-white mb-1">Connected Accounts</h2>
                        <p className="text-sm font-mono text-zinc-500">Manage your linked social accounts.</p>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-xl bg-black">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-white"><Github size={20} /></div>
                          <div>
                            <p className="font-medium text-sm text-white">GitHub</p>
                            <p className="text-xs font-mono text-zinc-500">Connected as @felix_dev</p>
                          </div>
                        </div>
                        <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white font-mono text-xs rounded-lg hover:bg-zinc-800">Disconnect</Button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-dashed border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-white transition-colors cursor-pointer rounded-xl bg-transparent">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center"><Mail size={20} /></div>
                          <p className="font-medium text-sm">Connect Google Account</p>
                        </div>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'account' && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 overflow-hidden">
                  <div className="p-6 border-b border-zinc-800/50">
                    <h2 className="text-lg font-display font-medium text-white mb-1">Email Addresses</h2>
                    <p className="text-sm font-mono text-zinc-500">Manage your primary and backup email addresses.</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-xl bg-black">
                      <div>
                        <p className="font-medium text-sm text-white flex items-center gap-2">felix@example.com <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] px-1.5 font-mono">Primary</Badge></p>
                        <p className="text-xs font-mono text-zinc-500 mt-1">Verified on Oct 24, 2023</p>
                      </div>
                      <CheckCircle2 size={18} className="text-green-500" />
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-900 flex justify-start border-t border-zinc-800/50">
                    <Button variant="outline" className="border-zinc-700 bg-black text-zinc-300 hover:text-white font-mono rounded-xl hover:bg-zinc-800">Add Email Address</Button>
                  </div>
                </div>
              )}

              {(!['profile', 'account'].includes(activeTab)) && (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                    <Shield size={24} className="text-zinc-600" />
                  </div>
                  <h3 className="text-xl font-display font-medium text-white mb-2">Coming Soon</h3>
                  <p className="text-zinc-500 font-mono text-sm max-w-sm">This settings area is under construction. Check back soon for more specialized configuration options.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

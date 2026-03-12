'use client'

import { useState, useEffect } from 'react'
import {
  Terminal as TerminalIcon, FileCode, Play, Save, Share2,
  Bot, Clock, Activity, Search, ChevronRight, ChevronDown,
  Layout, PanelLeft, PanelRight, MessageSquare, Shield,
  Eye, Zap, Globe, GitBranch
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useStore } from '@/store/useStore'

export default function EditorPage() {
  const { currentUser, isAdmin } = useStore()
  const [activeFile, setActiveFile] = useState('src/app/page.tsx')
  const [code, setCode] = useState('// ── ANTIGRAVITY NEURAL ENGINE ──────────────────────────────────────\n// Protocol: v4.0.2-stable\n// Sequence: 8Xf-99-A\n\nimport { useEffect } from \'react\'\n\nexport default function NeuralCore() {\n  useEffect(() => {\n    console.log("Antigravity pulse active.");\n  }, []);\n\n  return (\n    <div className="neural-grid">\n      <h1 className="text-gradient">Core Optimized</h1>\n    </div>\n  );\n}')
  const [sessionActive, setSessionActive] = useState(false)
  const [aiChat, setAiChat] = useState<{ role: 'user' | 'agent'; text: string }[]>([
    { role: 'agent', text: 'Neural Intelligence Agent online. Advanced code structural analysis active. How can I assist your session?' }
  ])
  const [prompt, setPrompt] = useState('')

  const isPro = currentUser?.plan === 'pro' || currentUser?.plan === 'team' || isAdmin()

  const files = [
    { name: 'src/app/page.tsx', lang: 'typescript' },
    { name: 'src/lib/supabase.ts', lang: 'typescript' },
    { name: 'src/store/useStore.ts', lang: 'typescript' },
    { name: 'public/globals.css', lang: 'css' },
    { name: 'next.config.js', lang: 'javascript' },
  ]

  const handlePrompt = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    if (!isPro) {
      setAiChat(prev => [...prev, { role: 'user', text: prompt }, { role: 'agent', text: 'AI Neural Mapping is a Premium protocol. Synchronize subscription to unlock.' }])
      setPrompt('')
      return
    }
    setAiChat(prev => [...prev, { role: 'user', text: prompt }, { role: 'agent', text: 'Neural scan complete. Found 2 structural vulnerabilities. Recommendation: Abstract the data fetching logic into a custom hook.' }])
    setPrompt('')
  }

  const generateSession = () => {
    setSessionActive(true)
    const link = `https://collabdebt.vercel.app/collab/join?session=${Math.random().toString(36).slice(2, 9)}`
    navigator.clipboard.writeText(link)
    toast.success('Secure Collaboration Link uplinked to clipboard.')
  }

  return (
    <div style={{ 
      height: 'calc(100vh - 48px)', 
      display: 'flex', 
      flexDirection: 'column', 
      background: '#020609', 
      marginTop: '-24px', 
      marginLeft: '-24px', 
      marginRight: '-24px', 
      position: 'relative', 
      overflow: 'hidden',
      color: '#fff' 
    }}>
      
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0, 242, 255, 0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Modern Toolbar */}
      <div className="glass h-10 px-4 flex items-center justify-between border-b border-white/5 z-20">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Live Workspace</span>
           </div>
           <div className="h-4 w-[1px] bg-white/10" />
           <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
              <FileCode size={14} />
              <span className="hover:text-white transition-colors">{activeFile}</span>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all">
              <Save size={12} className="text-blue-400" /> Commit
           </button>
           <button className="flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-400 transition-all">
              <Play size={12} /> Execute
           </button>
           <div className="h-4 w-[1px] bg-white/10" />
           <button 
             onClick={generateSession} 
             className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 transition-all"
           >
              <Share2 size={12} /> {sessionActive ? 'Add Uplinks' : 'Initiate Collab'}
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden z-10">
        
        {/* Explorer Panel */}
        <aside className="w-60 glass border-r border-white/5 flex flex-col">
           <div className="p-4 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Explorer</span>
              <Activity size={12} className="text-emerald-400/50" />
           </div>
           <nav className="flex-1 overflow-y-auto px-2 space-y-1">
              {files.map(f => (
                <div 
                  key={f.name}
                  onClick={() => setActiveFile(f.name)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all ${activeFile === f.name ? 'bg-white/5 text-blue-400 border border-white/5 shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                >
                   <FileCode size={14} className={activeFile === f.name ? 'text-blue-400' : 'text-slate-600'} />
                   <span className="text-xs font-bold truncate">{f.name.split('/').pop()}</span>
                   {activeFile === f.name && <div className="ml-auto w-1 h-3 rounded-full bg-blue-400" />}
                </div>
              ))}
           </nav>
           <div className="p-4 border-t border-white/5">
              <div className="glass-card p-3 space-y-2">
                 <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                    <span>Health Score</span>
                    <span className="text-emerald-400">Stable</span>
                 </div>
                 <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-emerald-400 shadow-[0_0_10px_#10b981]" />
                 </div>
              </div>
           </div>
        </aside>

        {/* Neural Editor Area */}
        <main className="flex-1 flex flex-col relative">
           <div className="flex-1 flex">
              {/* Line Numbers Simulation */}
              <div className="w-12 bg-black/20 border-r border-white/5 flex flex-col items-center pt-8 text-[10px] font-mono text-slate-700 select-none">
                 {[...Array(20)].map((_, i) => (
                   <div key={i} className="h-6">{i + 1}</div>
                 ))}
              </div>
              <textarea 
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 bg-transparent p-8 font-mono text-[13px] leading-[1.8] text-slate-300 outline-none resize-none custom-scrollbar"
                style={{ caretColor: 'var(--blue)' }}
              />
           </div>

           {/* Integrated Command Terminal */}
           <div className="h-40 glass border-t border-white/5 flex flex-col">
              <div className="h-8 px-4 flex items-center justify-between border-b border-white/5 bg-black/20">
                 <div className="flex items-center gap-2">
                    <TerminalIcon size={12} className="text-slate-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Neural Log Output</span>
                 </div>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400">
                       <Zap size={10} /> Sync 14ms
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-blue-400">
                       <GitBranch size={10} /> Main
                    </div>
                 </div>
              </div>
              <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto space-y-1 custom-scrollbar">
                 <div className="text-emerald-400">[SYSTEM] Intelligence Engine V4 uplink established...</div>
                 <div className="text-slate-500">[INFO] Workspace mapped to 12.4GB repository structure.</div>
                 <div className="text-yellow-400">[WARN] Security Policy: Unsigned commits detected in 2 branches.</div>
                 <div className="text-slate-500 flex items-center gap-2">
                    <span className="text-blue-400">➜</span>
                    <span className="text-white animate-pulse">_</span>
                 </div>
              </div>
           </div>
        </main>

        {/* Intelligence Sidebar */}
        <aside className="w-72 glass border-l border-white/5 flex flex-col">
           {/* Surveillance Module */}
           {(currentUser?.role === 'manager' || isAdmin()) && (
              <div className="p-4 border-b border-white/5 bg-red-500/5">
                 <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-red-500 mb-4">
                    <Shield size={12} /> Surveillance Mode
                 </div>
                 <div className="glass p-3 rounded-xl border-red-500/20">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white border border-white/10">JC</div>
                       <div>
                          <p className="text-[11px] font-bold text-white">Jane Cooper</p>
                          <p className="text-[9px] text-slate-500 capitalize">Role: Developer</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                       <Activity size={12} className="animate-pulse" /> 104 ACTIONS/MIN
                    </div>
                 </div>
              </div>
           )}

           {/* AI Chat Logic */}
           <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
                 <Bot size={13} /> Neural Interaction
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2 mb-4">
                 {aiChat.map((m, i) => (
                   <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5 shadow-2xl'}`}>
                         {m.text}
                      </div>
                   </div>
                 ))}
              </div>
              <form onSubmit={handlePrompt} className="relative mt-auto">
                 <input 
                   value={prompt}
                   onChange={e => setPrompt(e.target.value)}
                   className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 pr-12 text-xs focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                   placeholder="Neural request..."
                 />
                 <button type="submit" className="absolute right-2 top-2 w-7 h-7 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center text-white transition-all">
                    <ChevronRight size={16} />
                 </button>
              </form>
           </div>
        </aside>
      </div>
    </div>
  )
}

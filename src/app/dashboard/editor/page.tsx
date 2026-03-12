'use client'

import { useState, useEffect } from 'react'
import {
  Terminal as TerminalIcon, FileCode, Play, Save, Share2,
  Bot, Clock, Activity, Search, ChevronRight, ChevronDown,
  Layout, PanelLeft, PanelRight, MessageSquare, Shield,
  Eye, Zap, Globe, GitBranch, X
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useStore } from '@/store/useStore'

export default function EditorPage() {
  const { currentUser, isAdmin } = useStore()
  const [activeFile, setActiveFile] = useState('src/app/page.tsx')
  const [openFiles, setOpenFiles] = useState(['src/app/page.tsx', 'src/lib/supabase.ts'])
  const [code, setCode] = useState('import { createClient } from \'@supabase/supabase-js\'\n\nconst supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL\nconst supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY\n\nexport const supabase = createClient(supabaseUrl!, supabaseAnonKey!)\n\nexport async function getDebtItems(repoId: string) {\n  const { data, error } = await supabase\n    .from(\'debt_items\')\n    .select(\'*\')\n    .eq(\'repo_id\', repoId)\n    .order(\'created_at\', { ascending: false })\n\n  if (error) throw error\n  return data\n}')
  const [sessionActive, setSessionActive] = useState(false)
  const [aiChat, setAiChat] = useState<{ role: 'user' | 'agent'; text: string }[]>([
    { role: 'agent', text: 'Assistant online. Analysis active for workspace. How can I help?' }
  ])
  const [prompt, setPrompt] = useState('')

  const isPro = currentUser?.plan === 'pro' || currentUser?.plan === 'team' || isAdmin()

  const files = [
    { name: 'src/app/page.tsx', lang: 'typescript', status: 'modified' },
    { name: 'src/lib/supabase.ts', lang: 'typescript', status: 'unmodified' },
    { name: 'src/store/useStore.ts', lang: 'typescript', status: 'added' },
    { name: 'public/globals.css', lang: 'css', status: 'unmodified' },
    { name: 'next.config.js', lang: 'javascript', status: 'unmodified' },
  ]

  const handlePrompt = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    if (!isPro) {
      setAiChat(prev => [...prev, { role: 'user', text: prompt }, { role: 'agent', text: 'Advanced code analysis is a Pro feature. Please upgrade your workspace to unlock AI-assisted refactoring.' }])
      setPrompt('')
      return
    }
    setAiChat(prev => [...prev, { role: 'user', text: prompt }, { role: 'agent', text: 'Analysis complete. I recommend abstracting the database connection into a singleton pattern to avoid connection pooling issues in serverless environments. Would you like me to generate the refactor?' }])
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
            <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
              {files.map(f => (
                <div 
                  key={f.name}
                  onClick={() => {
                    setActiveFile(f.name)
                    if (!openFiles.includes(f.name)) setOpenFiles([...openFiles, f.name])
                  }}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded cursor-pointer transition-all ${activeFile === f.name ? 'bg-white/5 text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                   <FileCode size={14} className={activeFile === f.name ? 'text-blue-400' : 'text-slate-500'} />
                   <span className="text-xs font-medium truncate">{f.name.split('/').pop()}</span>
                   {f.status === 'modified' && <span className="ml-auto text-[10px] text-yellow-500/80 font-bold">M</span>}
                   {f.status === 'added' && <span className="ml-auto text-[10px] text-green-500/80 font-bold">A</span>}
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

         {/* Editor Area with Tabs */}
         <main className="flex-1 flex flex-col relative bg-[#050a0f]">
            {/* Tabs Bar */}
            <div className="flex bg-black/20 border-b border-white/5">
              {openFiles.map(f => (
                <div key={f} 
                  onClick={() => setActiveFile(f)}
                  className={`px-4 py-2 text-[11px] font-medium border-r border-white/5 flex items-center gap-2 cursor-pointer transition-all ${activeFile === f ? 'bg-[#050a0f] text-white' : 'text-slate-500 hover:bg-white/5'}`}>
                  <FileCode size={12} className={activeFile === f ? 'text-blue-400' : 'text-slate-500'} />
                  {f.split('/').pop()}
                  <X size={10} className="ml-2 hover:text-white" onClick={(e) => {
                    e.stopPropagation()
                    setOpenFiles(openFiles.filter(o => o !== f))
                  }} />
                </div>
              ))}
            </div>

            <div className="flex-1 flex">
              {/* Line Numbers Simulation */}
              <div className="w-12 border-r border-white/5 flex flex-col items-center pt-6 text-[11px] font-mono text-slate-700 select-none">
                 {[...Array(30)].map((_, i) => (
                   <div key={i} className="h-6">{i + 1}</div>
                 ))}
              </div>
              <textarea 
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 bg-transparent p-6 font-mono text-[13px] leading-[1.8] text-slate-300 outline-none resize-none custom-scrollbar"
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

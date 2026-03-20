import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { Avatar, Button, Spinner } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MentorPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'debug', 'history'
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('// Paste code here for architectural review...\n\nfunction example() {\n  console.log("Analyzing structure...");\n}');
  const [debugOutput, setDebugOutput] = useState(null);
  const [history, setHistory] = useState([
    { id: 1, title: 'React Performance Audit', date: '2026-03-18' },
    { id: 2, title: 'Node.js Security Review', date: '2026-03-19' },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { role: 'assistant', content: "Protocol initialized. I am your Lead AI Architect. I can perform deep-code analysis, debug complex logic, or guide your system design phase. What is our objective?" }
      ]);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/mentor/chat', { message: input, context: activeTab === 'debug' ? 'debugging' : 'general' });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Interface sync failed. Connection to Core Intelligence lost." }]);
    }
    setLoading(false);
  };

  const runDebug = () => {
    setLoading(true);
    setDebugOutput({ status: 'analyzing', message: 'Scanning AST for architectural anti-patterns...' });
    setTimeout(() => {
      setDebugOutput({
        status: 'ready',
        findings: [
          { type: 'optimization', msg: 'Closure scope could be minimized.' },
          { type: 'security', msg: 'Ensure input sanitization for external parameters.' },
          { type: 'structure', msg: 'Module export pattern matches industry standards.' }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-[1400px] mx-auto h-[calc(100vh-8rem)] flex gap-6 font-sans animate-fade-in pt-2">
      
      {/* ─── LEFT SIDEBAR (TABS) ─── */}
      <div className="w-20 shrink-0 flex flex-col gap-4 py-6 bg-[#0A0A0F]/60 border border-white/5 rounded-[32px] items-center backdrop-blur-xl shadow-2xl">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-6">
          <Icons.Zap size={20} className="text-blue-500" />
        </div>
        
        {[
          { id: 'chat',    icon: Icons.MessageSquare, label: 'Chat' },
          { id: 'debug',   icon: Icons.Terminal,      label: 'Debug' },
          { id: 'history', icon: Icons.Clock,         label: 'History' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-500 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon size={20} />
            <span className="absolute left-full ml-4 px-2 py-1 rounded bg-slate-900 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap border border-white/10 uppercase tracking-widest">
              {tab.label}
            </span>
          </button>
        ))}

        <div className="mt-auto pt-4 border-t border-white/5 w-10 flex flex-col items-center gap-4">
           <button className="text-slate-600 hover:text-white transition-colors"><Icons.Settings size={18} /></button>
        </div>
      </div>

      {/* ─── MAIN INTERACTION PANEL ─── */}
      <div className="flex-1 flex flex-col bg-[#0A0A0F]/40 border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-md shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between relative z-10">
          <div>
            <h1 className="font-display font-black text-2xl text-white tracking-tight uppercase">
              {activeTab === 'chat' && 'Architect Console'}
              {activeTab === 'debug' && 'Deep-Scan Diagnostics'}
              {activeTab === 'history' && 'Transmission History'}
            </h1>
            <p className="font-mono text-[9px] text-slate-500 uppercase tracking-[0.3em] mt-1 font-black">
              {activeTab === 'chat' && 'Real-time synchronization with primary node'}
              {activeTab === 'debug' && 'Analyzing logic clusters and instruction sets'}
              {activeTab === 'history' && 'Accessing historical ledger entries'}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full border border-emerald-500/20">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-widest">Intelligence Locked</span>
             </div>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-hidden flex flex-col relative z-10">
          
          {/* ────── CHAT VIEW ────── */}
          {activeTab === 'chat' && (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-6 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className="shrink-0 pt-1">
                      {m.role === 'assistant' ? (
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 shadow-xl flex items-center justify-center border border-blue-400/30">
                          <Icons.Code size={22} className="text-white" />
                        </div>
                      ) : (
                        <Avatar user={user} size={48} className="rounded-2xl border-2 border-white/10 ring-4 ring-blue-600/5 shadow-2xl" />
                      )}
                    </div>
                    <div className={`p-6 rounded-[28px] text-[15px] leading-relaxed shadow-xl ${
                      m.role === 'user' 
                        ? 'bg-blue-600 text-white border border-blue-500/50' 
                        : 'bg-[#11111A] border border-white/5 text-slate-100'
                    }`}>
                      {m.role === 'user' ? (
                        <p className="whitespace-pre-wrap font-medium">{m.content}</p>
                      ) : (
                        <ReactMarkdown
                          className="prose prose-invert max-w-none font-medium"
                          components={{
                            code({node, inline, className, children, ...props}) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <div className="my-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                  <div className="bg-white/5 px-5 py-2.5 border-b border-white/5 flex justify-between items-center">
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{match[1]} instruction set</span>
                                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                                  </div>
                                  <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" className="!m-0 !bg-[#050508] !p-6 !text-sm" {...props}>
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                </div>
                              ) : (
                                <code className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-lg font-mono text-[13px] font-bold" {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                           {m.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                   <div className="flex gap-6 max-w-[85%]">
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center animate-pulse">
                      <Icons.Zap size={22} className="text-blue-500" />
                    </div>
                    <div className="p-6 rounded-[28px] bg-[#11111A] border border-white/5 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{animationDelay: '0.2s'}} />
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{animationDelay: '0.4s'}} />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-8 border-t border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto relative flex items-center group">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                         e.preventDefault();
                         handleSend();
                      }
                    }}
                    placeholder="Broadcast architectural query..."
                    className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-7 pr-16 text-[15px] font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all resize-none shadow-inner"
                    rows={1}
                    style={{ minHeight: '64px', maxHeight: '200px' }}
                  />
                  <button 
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="absolute right-4 w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 disabled:opacity-30 transition-all shadow-xl shadow-blue-600/20 active:scale-90"
                  >
                    <Icons.ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ────── DEBUG VIEW ────── */}
          {activeTab === 'debug' && (
            <div className="flex-1 flex overflow-hidden">
               <div className="flex-1 flex flex-col p-8 gap-6 border-r border-white/5">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-black">Source Input Cluster</p>
                    <button onClick={() => setCode('')} className="text-[10px] text-slate-500 hover:text-white uppercase font-black tracking-widest">Wipe Memory</button>
                  </div>
                  <div className="flex-1 rounded-[32px] border border-white/5 bg-[#050508] p-6 overflow-hidden relative group">
                    <textarea 
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-full bg-transparent text-blue-400 font-mono text-sm outline-none resize-none scrollbar-hide"
                    />
                    <button 
                      onClick={runDebug}
                      disabled={loading}
                      className="absolute bottom-6 right-6 px-8 py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-blue-600/40 hover:bg-blue-500 transition-all flex items-center gap-3 active:scale-95"
                    >
                      {loading ? <Spinner size={14} className="border-white/30 border-t-white" /> : <Icons.Play size={14} />} 
                      Initialize Scan
                    </button>
                  </div>
               </div>

               {/* Debug Sidebar/Output */}
               <div className="w-[400px] bg-[#020205]/40 p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                  <h3 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-black border-b border-white/5 pb-4">Diagnostic Output</h3>
                  
                  {!debugOutput && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-20">
                       <Icons.Shield size={48} className="text-slate-600 mb-6" />
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Awaiting Instruction</p>
                    </div>
                  )}

                  {debugOutput?.status === 'analyzing' && (
                    <div className="space-y-6 animate-pulse">
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-1/2 animate-shimmer" />
                      </div>
                      <p className="font-mono text-xs text-blue-400">{debugOutput.message}</p>
                    </div>
                  )}

                  {debugOutput?.status === 'ready' && (
                    <div className="space-y-4">
                       {debugOutput.findings.map((f, i) => (
                         <div key={i} className="p-5 rounded-2xl bg-[#11111A] border border-white/5 border-l-2 border-l-blue-600 animate-slide-up" style={{animationDelay: `${i*100}ms`}}>
                            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2">{f.type} signal</p>
                            <p className="text-sm text-slate-300 leading-relaxed">{f.msg}</p>
                         </div>
                       ))}
                       <div className="pt-6 mt-6 border-t border-white/5">
                         <Button block variant="outline" className="border-white/5 text-slate-400 text-[10px] py-4 rounded-2xl uppercase tracking-widest font-black">Generate Patch Protocol</Button>
                       </div>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* ────── HISTORY VIEW ────── */}
          {activeTab === 'history' && (
            <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {history.map(h => (
                    <div key={h.id} className="group p-8 rounded-[32px] bg-[#11111A] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-[40px] pointer-events-none group-hover:bg-blue-600/10 transition-colors" />
                       <Icons.MessageSquare size={24} className="text-blue-500 mb-6" />
                       <h3 className="font-display font-black text-xl text-white mb-2 group-hover:text-blue-400 transition-colors">{h.title}</h3>
                       <p className="font-mono text-[9px] text-slate-600 uppercase tracking-widest font-black mb-8 px-3 py-1 bg-white/5 rounded-lg inline-block">{h.date}</p>
                       <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                         Recall Protocol <Icons.ArrowRight size={10} />
                       </div>
                    </div>
                  ))}
                  <div className="p-8 rounded-[32px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/3 transition-all">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icons.Plus size={24} className="text-slate-600" />
                    </div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">New Archive Entry</p>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

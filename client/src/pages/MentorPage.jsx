import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Spinner, BadgeTag } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const SUGGESTION_CHIPS = [
  'Explain closures in JavaScript',
  'Review my code for bugs',
  'How does Big O work?',
  'Explain recursion visually',
  'What is the event loop?',
  'Design a REST API',
];

const MODES = [
  { id: 'tutor', label: 'Tutor', icon: Icons.Book, color: 'text-indigo-600' },
  { id: 'dev', label: 'Senior Dev', icon: Icons.Terminal, color: 'text-slate-900' },
];

// ─── TYPING INDICATOR ──────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-4 animate-in slide-in-from-bottom-2 duration-300">
      <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">AI</div>
      <div className="px-5 py-4 rounded-3xl rounded-tl-md bg-white border border-slate-200 shadow-sm">
        <div className="flex gap-1.5 h-4 items-center">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-bounce" 
              style={{ animationDelay: `${i * 0.1}s` }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MARKDOWN RENDERER ────────────────────────────────────
function MsgContent({ content }) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-3">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const lines = part.split('\n');
          const lang  = lines[0].replace('```', '').trim() || 'code';
          const code  = lines.slice(1, -1).join('\n');
          return (
            <div key={i} className="relative group rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">{lang}</span>
                <button onClick={() => { navigator.clipboard.writeText(code); toast.success('Copied'); }}
                  className="font-mono text-[10px] text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all uppercase font-bold">Copy</button>
              </div>
              <pre className="bg-[#1E1E1E] p-4 overflow-x-auto text-[12px] font-mono text-[#D4D4D4] leading-relaxed custom-scrollbar"><code>{code}</code></pre>
            </div>
          );
        }
        const rendered = part.split(/(\*\*.*?\*\*|`.*?`)/g).map((chunk, ci) => {
          if (chunk.startsWith('**') && chunk.endsWith('**')) return <strong key={ci} className="font-bold text-slate-900">{chunk.slice(2,-2)}</strong>;
          if (chunk.startsWith('`') && chunk.endsWith('`')) return <code key={ci} className="font-mono text-xs bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-blue-700">{chunk.slice(1,-1)}</code>;
          return <span key={ci}>{chunk}</span>;
        });
        return <div key={i} className="text-[13px] leading-relaxed whitespace-pre-wrap text-slate-700">{rendered}</div>;
      })}
    </div>
  );
}

// ─── MESSAGE BUBBLE ────────────────────────────────────────
function Message({ msg, onRetry }) {
  const isUser  = msg.role === 'user';
  const isError = msg.error;

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''} group animate-in fade-in slide-in-from-bottom-2`}>
      <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-[10px] font-black shadow-md mt-1 ${
        isUser ? 'bg-blue-600 text-white' : isError ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'
      }`}>
        {isUser ? 'U' : isError ? '!' : 'AI'}
      </div>
      <div className={`max-w-[80%] flex flex-col gap-1.5 ${isUser ? 'items-end' : ''}`}>
        <div className={`px-5 py-4 rounded-[1.5rem] shadow-sm transition-all ${
          isError ? 'bg-red-50 border border-red-200 rounded-tl-md'
            : isUser ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-white border border-slate-100 rounded-tl-none hover:shadow-md'
        }`}>
          {isError ? (
            <div className="space-y-3">
              <p className="text-sm font-bold text-red-600">Sync Interrupted</p>
              <p className="text-[11px] text-red-500 leading-tight">The AI signal was lost. Please check your network or try again.</p>
              <button onClick={onRetry} className="flex items-center gap-2 text-[10px] font-black uppercase text-red-600 hover:text-red-700 underline tracking-[0.05em]">
                Re-establish Link
              </button>
            </div>
          ) : isUser ? (
            <div className="text-[13px] leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</div>
          ) : (
            <MsgContent content={msg.content} />
          )}
        </div>
        <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {msg.timestamp ? format(new Date(msg.timestamp), 'HH:mm') : ''}
        </span>
      </div>
    </div>
  );
}

// ─── QUOTA MODAL ──────────────────────────────────────────
function QuotaModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 text-center text-left-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Icons.Zap size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Transmission Blocked</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-8">
            Daily request quota (100/100) exhausted. Power cycles occur daily at <span className="font-bold text-blue-600">12:00 UTC</span>.
          </p>
          <Button onClick={onClose} variant="primary" className="w-full py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-xs">
            Protocol Understood
          </Button>
        </div>
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">SkillForge Professional Tier</p>
        </div>
      </div>
    </div>
  );
}

// ─── CODE RUNNER / PANEL ──────────────────────────────────
function CodePanel({ visible, onClose }) {
  const [code, setCode]         = useState('// write or paste code here\nconsole.log("Hello, SkillForge!");');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput]     = useState('');
  const [running, setRunning]   = useState(false);
  const [status, setStatus]     = useState(null);

  const runCode = async () => {
    setRunning(true); setOutput(''); setStatus('RUNNING');
    try {
      const r = await api.post('/code/execute', { code, language });
      setOutput(r.data.output);
      setStatus(r.data.status || 'FINISHED');
      if (r.data.fallback) toast.success('Running in sandbox mode');
    } catch (err) {
      if (err.response?.status === 503) {
        setOutput('Error: Code execution service unavailable.\n\nTip: Please add JUDGE0_URL and JUDGE0_KEY to your server .env file to enable the fully-powered multi-language runner.');
      } else {
        setOutput('Error: ' + (err.response?.data?.error || 'Execution failed'));
      }
      setStatus('FAILED');
    }
    setRunning(false);
  };

  if (!visible) return null;

  return (
    <div className="w-[480px] flex-shrink-0 flex flex-col bg-[#0D1117] border-l border-[#30363D] animate-in slide-in-from-right duration-300">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363D] bg-[#161B22]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${running ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]' : 'bg-green-500 shadow-[0_0_8px_#22c55e]'}`} />
          </div>
          <span className="text-[11px] font-mono font-black text-slate-300 uppercase tracking-[0.2em]">Interactive System Console</span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all">
          <Icons.X size={16} />
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0D1117] border-b border-[#30363D] overflow-x-auto no-scrollbar">
          {['javascript', 'python', 'java', 'cpp', 'go'].map(lang => (
            <button key={lang} onClick={() => setLanguage(lang)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold capitalize transition-all border ${
                language === lang ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/20' : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}>{lang}</button>
          ))}
          <div className="flex-1 min-w-[20px]" />
          <button onClick={runCode} disabled={running}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-[11px] font-black transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-green-900/20 uppercase tracking-widest">
            {running ? <Spinner size={12} /> : <Icons.Zap size={12} className="fill-white" />} RUN
          </button>
        </div>

        <div className="flex-1 relative overflow-hidden bg-[#0D1117] group">
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setCode('')} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white border border-[#30363D] transition-all" title="Clear Code">
              <Icons.RefreshCw size={14} />
            </button>
          </div>
          <textarea className="absolute inset-0 w-full h-full bg-transparent text-[#E6EDF3] font-mono text-sm p-6 outline-none resize-none selection:bg-blue-500/30 custom-scrollbar"
            spellCheck={false} value={code} onChange={e => setCode(e.target.value)}
            placeholder="// Enter system instructions or core logic..."
          />
        </div>

        {/* Terminal Output */}
        <div className="h-64 border-t border-[#30363D] bg-[#010409] flex flex-col">
          <div className="px-6 py-2.5 border-b border-[#30363D] flex justify-between items-center bg-[#161B22]">
            <span className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-[0.2em]">Standard Output</span>
            {status && (
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-mono font-black border px-2 py-0.5 rounded ${
                  status === 'FAILED' ? 'text-red-500 border-red-900/50' : 'text-blue-400 border-blue-900/50'
                }`}>{status}</span>
                <button onClick={() => setOutput('')} className="text-slate-600 hover:text-slate-300 transition-colors"><Icons.X size={10} /></button>
              </div>
            )}
          </div>
          <div className="flex-1 p-6 font-mono text-[13px] text-green-500/90 overflow-y-auto whitespace-pre-wrap leading-relaxed custom-scrollbar selection:bg-green-500/10">
            {output || <span className="text-slate-600 italic font-medium opacity-50 block mt-4">// Awaiting execution commands...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN MENTOR PAGE ─────────────────────────────────────
export default function MentorPage() {
  const [sessions, setSessions]       = useState([]);
  const [activeSession, setActive]    = useState(null);
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [sending, setSending]         = useState(false);
  const [loading, setLoading]         = useState(true);
  const [sidebarTab, setSidebarTab]   = useState('sessions');
  const [historySearch, setHistorySearch] = useState('');
  const [showCodePanel, setShowCodePanel] = useState(true);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [activeMode, setActiveMode]   = useState('dev');
  
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get('/mentor').then(r => {
      const s = r.data.sessions || [];
      setSessions(s);
      if (s[0]) { setActive(s[0]); setMessages(Array.isArray(s[0].messages) ? s[0].messages : []); }
    }).catch(() => setSessions([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const newSession = async () => {
    try {
      const r = await api.post('/mentor/sessions', { topic: 'New Sync Mission' });
      setSessions(s => [r.data.session, ...s]);
      setActive(r.data.session);
      setMessages([]);
      setSidebarTab('sessions');
      toast.success('New Session Initialized');
    } catch { toast.error('Creation Failed'); }
  };

  const selectSession = (s) => { setActive(s); setMessages(Array.isArray(s.messages) ? s.messages : []); };

  const deleteSession = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/mentor/sessions/${id}`);
      setSessions(s => s.filter(x => x.id !== id));
      if (activeSession?.id === id) { setActive(null); setMessages([]); }
      toast.success('Session Terminated');
    } catch { toast.error('Termination Failed'); }
  };

  const clearChat = () => { if(window.confirm('Wipe current discussion history?')) setMessages([]); };

  const send = useCallback(async (msgText, retryIndex) => {
    const text = (msgText || input).trim();
    if (!text) return;

    let sessionId = activeSession?.id;
    if (!sessionId) {
      try {
        const r = await api.post('/mentor/sessions', { topic: text.slice(0, 40) });
        setSessions(s => [r.data.session, ...s]);
        setActive(r.data.session);
        sessionId = r.data.session.id;
      } catch (err) { 
        if (err.response?.data?.error === 'DAILY_LIMIT_REACHED') {
          setShowQuotaModal(true); return;
        }
        toast.error('Session Initialization Failed'); return; 
      }
    }

    if (retryIndex != null) setMessages(m => m.filter((_, i) => i !== retryIndex));
    else setMessages(m => [...m, { role: 'user', content: text, timestamp: new Date().toISOString() }]);

    setInput(''); setSending(true);

    try {
      // Note: Backend can handle 'mode' if needed in the future
      const r = await api.post(`/mentor/sessions/${sessionId}/message`, { message: text, mode: activeMode });
      const aiMsg = { role: 'assistant', content: r.data.response, timestamp: new Date().toISOString() };
      setMessages(m => [...m, aiMsg]);
      setSessions(s => s.map(x => x.id === sessionId ? { ...x, messages: [...(Array.isArray(x.messages) ? x.messages : []), { role: 'user', content: text, timestamp: new Date().toISOString() }, aiMsg] } : x));
    } catch (err) {
      if (err.response?.status === 429 && err.response?.data?.error === 'DAILY_LIMIT_REACHED') {
        setMessages(m => m.filter(msg => msg.content !== text)); 
        setShowQuotaModal(true);
      } else {
        setMessages(m => [...m, { role: 'assistant', content: '', timestamp: new Date().toISOString(), error: true, originalText: text }]);
      }
    }
    setSending(false);
  }, [input, activeSession, activeMode]);

  const handleRetry = (i) => { const m = messages[i]; if (m?.originalText) send(m.originalText, i); };

  if (loading) return <div className="flex justify-center py-48"><Spinner size={24} className="text-blue-600" /></div>;

  return (
    <>
      <div className="flex h-[calc(100vh-7rem)] overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/50">

        {/* ── LEFT: Sessions Sidebar (Premium & Compact) ── */}
        <div className="w-72 flex-shrink-0 flex flex-col border-r border-slate-100 bg-[#FBFBFC]">
          <div className="p-6">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4">Command History</h2>
            <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200/50 shadow-inner">
              {['sessions', 'history'].map(t => (
                <button key={t} onClick={() => setSidebarTab(t)}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    sidebarTab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4 custom-scrollbar">
            {sidebarTab === 'sessions' ? (
              <div className="space-y-1.5">
                <button onClick={newSession} className="w-full flex items-center justify-between gap-2 px-4 py-3.5 rounded-2xl bg-slate-900 text-white text-[11px] font-black border border-slate-900 hover:bg-slate-800 transition-all mb-4 group shadow-lg shadow-slate-900/10 uppercase tracking-widest">
                  Initialize Sync <Icons.Plus size={14} className="group-hover:rotate-90 transition-transform" />
                </button>
                {sessions.map(s => (
                  <button key={s.id} onClick={() => selectSession(s)}
                    className={`w-full text-left p-4 rounded-3xl group flex items-start gap-3 transition-all relative overflow-hidden ${
                      activeSession?.id === s.id ? 'bg-white border border-blue-100 shadow-lg ring-1 ring-blue-50/50' : 'hover:bg-white border border-transparent hover:shadow-sm'
                    }`}>
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full transition-colors ${activeSession?.id === s.id ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-slate-300 group-hover:bg-blue-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-slate-800 truncate tracking-tight uppercase">{s.topic || 'New Session'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-mono font-bold text-slate-400">{Array.isArray(s.messages) ? s.messages.length : 0} ops</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[9px] font-mono text-slate-300">{s.updatedAt ? format(new Date(s.updatedAt), 'HH:mm') : ''}</span>
                      </div>
                    </div>
                    {activeSession?.id === s.id && (
                      <button onClick={(e) => deleteSession(s.id, e)} className="p-1 px-2 rounded-lg bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">
                        <Icons.X size={10} />
                      </button>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-2 py-4 text-center">
                 <Icons.Search size={24} className="mx-auto text-slate-200 mb-2" />
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Archive Module Offline</p>
              </div>
            )}
          </div>
        </div>

        {/* ── MIDDLE: Performance Chat Pane ── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FCFCFD]">
          {/* Aligned System Header */}
          <div className="h-20 flex items-center justify-between px-8 border-b border-slate-100 bg-white/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-[1.25rem] bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-200 border border-slate-800">
                <Icons.Terminal size={18} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-black text-[13px] text-slate-900 tracking-tight uppercase">AI Engineering Mentor</h3>
                  <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100/50">
                    <div className="w-1 h-1 rounded-full bg-green-600 animate-pulse shadow-[0_0_4px_#16a34a]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.15em]">System active</span>
                  </div>
                </div>
                <p className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest mt-0.5">Optimizing Logic Hub · v3.3.4</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex p-0.5 bg-slate-100 rounded-xl border border-slate-200/50 mr-2">
                {MODES.map(m => (
                  <button key={m.id} onClick={() => setActiveMode(m.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeMode === m.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}>
                    <m.icon size={11} className={activeMode === m.id ? m.color : ''} /> {m.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowCodePanel(v => !v)}
                className={`p-2.5 rounded-xl border transition-all ${
                  showCodePanel ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`} title="Toggle System Console">
                <Icons.Code size={16} />
              </button>
            </div>
          </div>

          {/* Unified Messages Area */}
          <div className="flex-1 overflow-y-auto px-10 py-10 space-y-8 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center max-w-sm mx-auto text-center">
                <div className="w-20 h-20 rounded-[2.5rem] bg-white flex items-center justify-center mb-8 border border-slate-100 shadow-2xl shadow-slate-100">
                  <Icons.Zap size={32} className="text-blue-600" />
                </div>
                <h4 className="font-black text-slate-900 text-xl mb-3 tracking-tight uppercase">Cognitive Sync Ready</h4>
                <p className="text-sm text-slate-400 mb-10 leading-relaxed font-medium px-4">Transmit your engineering queries regarding architecture, debugging, or optimization.</p>
                <div className="grid grid-cols-2 gap-3 w-full">
                  {SUGGESTION_CHIPS.map(chip => (
                    <button key={chip} onClick={() => send(chip)}
                      className="px-4 py-3 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 rounded-[1.25rem] text-[10px] font-black text-slate-500 transition-all truncate uppercase tracking-widest active:scale-95 shadow-sm">
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-center -mt-4 mb-4">
                  <button onClick={clearChat} className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-300 hover:text-slate-500 tracking-[0.2em] transition-colors">
                    <Icons.RefreshCw size={10} /> Reset Sync History
                  </button>
                </div>
                {messages.map((msg, i) => <Message key={i} msg={msg} onRetry={() => handleRetry(i)} />)}
              </>
            )}
            {sending && <TypingIndicator />}
            <div ref={bottomRef} className="h-8" />
          </div>

          {/* Premium Transmission Bar */}
          <div className="px-8 pb-8 pt-4 bg-transparent mt-auto sticky bottom-0">
            <div className="flex items-end gap-3 bg-white border border-slate-200 rounded-[1.75rem] px-5 py-3 shadow-2xl shadow-slate-200/40 focus-within:border-blue-400 focus-within:shadow-blue-900/5 transition-all duration-500 ring-1 ring-transparent focus-within:ring-blue-100">
              <textarea className="flex-1 bg-transparent resize-none outline-none text-sm text-slate-700 placeholder:text-slate-400 py-2.5 custom-scrollbar font-medium"
                rows={1} style={{ minHeight: 40, maxHeight: 200 }}
                value={input} onChange={e => setInput(e.target.value)}
                placeholder="Initialize new transmission sequence..."
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
              />
              <div className="flex items-center gap-2 pb-1.5">
                 <button onClick={() => setInput('')} className={`p-2 rounded-xl hover:bg-slate-50 text-slate-300 transition-all ${input ? 'opacity-100' : 'opacity-0'}`}>
                   <Icons.X size={16} />
                 </button>
                 <button onClick={() => send()} disabled={!input.trim() || sending}
                  className="w-11 h-11 rounded-2xl bg-slate-900 hover:bg-blue-600 disabled:bg-slate-100 text-white flex items-center justify-center transition-all shadow-xl shadow-slate-900/10 active:scale-95 group">
                  {sending ? <Spinner size={16} /> : <Icons.ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em]">Neural Link: Stable</p>
               <span className="w-1 h-1 rounded-full bg-slate-200" />
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em]">Precision: Max Engagement</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Integrated Performance Console ── */}
        <CodePanel visible={showCodePanel} onClose={() => setShowCodePanel(false)} />
      </div>

      <QuotaModal isOpen={showQuotaModal} onClose={() => setShowQuotaModal(false)} />
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </>
  );
}

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
  'How do React hooks work?',
  'Explain promises vs async/await',
  'Design a REST API',
];

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python',     label: 'Python' },
  { id: 'java',       label: 'Java' },
  { id: 'cpp',        label: 'C++' },
  { id: 'c',          label: 'C' },
  { id: 'go',         label: 'Go' },
  { id: 'rust',       label: 'Rust' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'ruby',       label: 'Ruby' },
  { id: 'php',        label: 'PHP' },
  { id: 'bash',       label: 'Bash' },
];

// ─── MARKDOWN RENDERER ────────────────────────────────────
function MsgContent({ content }) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-2">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const lines = part.split('\n');
          const lang  = lines[0].replace('```', '').trim() || 'code';
          const code  = lines.slice(1, -1).join('\n');
          return (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-slate-200">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b border-slate-200">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">{lang}</span>
                <button onClick={() => { navigator.clipboard.writeText(code); toast.success('Copied'); }}
                  className="font-mono text-[10px] text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all">copy</button>
              </div>
              <pre className="bg-slate-50 p-3 overflow-x-auto text-xs font-mono text-slate-700 leading-relaxed"><code>{code}</code></pre>
            </div>
          );
        }
        const rendered = part.split(/(\*\*.*?\*\*|`.*?`)/g).map((chunk, ci) => {
          if (chunk.startsWith('**') && chunk.endsWith('**')) return <strong key={ci} className="font-semibold text-slate-900">{chunk.slice(2,-2)}</strong>;
          if (chunk.startsWith('`') && chunk.endsWith('`')) return <code key={ci} className="font-mono text-xs bg-slate-100 border border-slate-200 px-1 py-0.5 rounded text-blue-700">{chunk.slice(1,-1)}</code>;
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
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} group`}>
      <div className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center text-[10px] font-mono font-bold mt-0.5 ${
        isUser ? 'bg-blue-600 text-white' : isError ? 'bg-red-100 text-red-500 border border-red-200' : 'bg-slate-800 text-white'
      }`}>
        {isUser ? 'U' : isError ? '!' : 'AI'}
      </div>
      <div className={`max-w-[75%] flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isError ? 'bg-red-50 border border-red-200 rounded-tl-md'
            : isUser ? 'bg-blue-600 text-white rounded-tr-md'
            : 'bg-white border border-slate-200 rounded-tl-md shadow-sm'
        }`}>
          {isError ? (
            <div className="space-y-2">
              <p className="text-sm text-red-600">AI service is temporarily unavailable.</p>
              <button onClick={onRetry} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 underline transition-colors">
                Retry this message
              </button>
            </div>
          ) : isUser ? (
            <div className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</div>
          ) : (
            <MsgContent content={msg.content} />
          )}
        </div>
        <span className="font-mono text-[10px] text-slate-400 px-1">
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
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Icons.Zap size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Daily Limit Reached</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-8">
            You've reached your daily quota of 100 mentor requests. To maintain high performance for everyone, quotas refill every day at 12:00 UTC.
          </p>
          <Button onClick={onClose} variant="primary" className="w-full py-4 rounded-2xl font-bold tracking-tight">
            Got it, see you tomorrow
          </Button>
        </div>
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SkillForge Professional</p>
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
    setRunning(true); setOutput(''); setStatus('Running...');
    try {
      const r = await api.post('/code/execute', { code, language });
      setOutput(r.data.output);
      setStatus(r.data.status || 'Finished');
      if (r.data.fallback) toast.success('Running in sandbox mode');
    } catch (err) {
      if (err.response?.status === 503) {
        setOutput('Error: Code execution service unavailable.\n\nTip: Please add JUDGE0_URL and JUDGE0_KEY to your server .env file to enable the fully-powered multi-language runner.');
      } else {
        setOutput('Error: ' + (err.response?.data?.error || 'Execution failed'));
      }
      setStatus('Failed');
    }
    setRunning(false);
  };

  if (!visible) return null;

  return (
    <div className="w-[450px] flex-shrink-0 flex flex-col bg-[#0D1117] border-l border-[#30363D] animate-in slide-in-from-right duration-300">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#30363D] bg-[#161B22]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
          <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-widest">Interactive Console</span>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
          <Icons.X size={14} />
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D1117] border-b border-[#30363D]">
          {['javascript', 'python', 'java', 'cpp', 'go'].map(lang => (
            <button key={lang} onClick={() => setLanguage(lang)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono capitalize transition-all ${
                language === lang ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}>{lang}</button>
          ))}
          <div className="flex-1" />
          <button onClick={runCode} disabled={running}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold transition-all disabled:opacity-50">
            {running ? <Spinner size={10} /> : <Icons.Zap size={10} className="fill-white" />} RUN
          </button>
        </div>

        <div className="flex-1 relative overflow-hidden bg-[#0D1117]">
          <textarea className="absolute inset-0 w-full h-full bg-transparent text-[#E6EDF3] font-mono text-sm p-5 outline-none resize-none selection:bg-blue-500/30"
            spellCheck={false} value={code} onChange={e => setCode(e.target.value)}
          />
        </div>

        {/* Terminal Output */}
        <div className="h-60 border-t border-[#30363D] bg-[#010409] flex flex-col">
          <div className="px-4 py-1.5 border-b border-[#30363D] flex justify-between items-center bg-[#161B22]">
            <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-widest">Execution Output</span>
            {status && <span className="text-[9px] font-mono text-blue-400 font-bold">{status}</span>}
          </div>
          <div className="flex-1 p-4 font-mono text-xs text-green-500/90 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {output || <span className="text-slate-600 italic">No output yet. Click 'RUN' to execute code.</span>}
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
      const r = await api.post('/mentor/sessions', { topic: 'New Session' });
      setSessions(s => [r.data.session, ...s]);
      setActive(r.data.session);
      setMessages([]);
      setSidebarTab('sessions');
    } catch { toast.error('Failed to create session'); }
  };

  const selectSession = (s) => { setActive(s); setMessages(Array.isArray(s.messages) ? s.messages : []); };

  const deleteSession = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/mentor/sessions/${id}`);
      setSessions(s => s.filter(x => x.id !== id));
      if (activeSession?.id === id) { setActive(null); setMessages([]); }
    } catch { toast.error('Failed to delete'); }
  };

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
          setShowQuotaModal(true);
          return;
        }
        toast.error('Failed to create session'); return; 
      }
    }

    if (retryIndex != null) {
      setMessages(m => m.filter((_, i) => i !== retryIndex));
    } else {
      setMessages(m => [...m, { role: 'user', content: text, timestamp: new Date().toISOString() }]);
    }

    setInput('');
    setSending(true);

    try {
      const r = await api.post(`/mentor/sessions/${sessionId}/message`, { message: text });
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
  }, [input, activeSession]);

  const handleRetry = (i) => { const m = messages[i]; if (m?.originalText) send(m.originalText, i); };

  const filteredSessions = historySearch
    ? sessions.filter(s => (s.topic || '').toLowerCase().includes(historySearch.toLowerCase()))
    : sessions;

  const groupedHistory = {};
  filteredSessions.forEach(s => {
    const date = s.updatedAt ? format(new Date(s.updatedAt), 'MMM d, yyyy') : 'Unknown';
    if (!groupedHistory[date]) groupedHistory[date] = [];
    groupedHistory[date].push(s);
  });

  if (loading) return <div className="flex justify-center py-24"><Spinner size={20} className="text-blue-600" /></div>;

  return (
    <>
      <div className="flex h-[calc(100vh-7rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">

        {/* ── LEFT: Sessions Sidebar ── */}
        <div className="w-64 flex-shrink-0 flex flex-col border-r border-slate-100 bg-[#FBFBFC]">
          <div className="flex p-1 m-3 bg-white rounded-xl border border-slate-200/60 shadow-sm">
            {['sessions', 'history'].map(t => (
              <button key={t} onClick={() => setSidebarTab(t)}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                  sidebarTab === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
                }`}>{t}</button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-4">
            {sidebarTab === 'sessions' ? (
              <div className="space-y-1">
                <button onClick={newSession} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600/5 text-blue-600 text-xs font-bold border border-blue-200/50 hover:bg-blue-600/10 transition-all mb-4 group">
                  <Icons.Plus size={14} className="group-hover:rotate-90 transition-transform" /> New Discussion
                </button>
                {sessions.map(s => (
                  <button key={s.id} onClick={() => selectSession(s)}
                    className={`w-full text-left p-3 rounded-2xl group flex items-center gap-3 transition-all ${
                      activeSession?.id === s.id ? 'bg-white border border-blue-200 shadow-sm ring-1 ring-blue-50' : 'hover:bg-white border border-transparent hover:shadow-sm'
                    }`}>
                    <div className={`w-1.5 h-1.5 rounded-full transition-colors ${activeSession?.id === s.id ? 'bg-blue-500' : 'bg-slate-300 group-hover:bg-blue-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 truncate tracking-tight">{s.topic || 'New Session'}</p>
                      <p className="text-[9px] font-mono text-slate-400 mt-0.5">{Array.isArray(s.messages) ? s.messages.length : 0} interactions</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              Object.entries(groupedHistory).map(([date, items]) => (
                <div key={date}>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">{date}</p>
                  <div className="space-y-1">
                    {items.map(s => (
                      <button key={s.id} onClick={() => selectSession(s)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-medium transition-all ${
                          activeSession?.id === s.id ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'hover:bg-white'
                        }`}>{s.topic || 'Session'}</button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── MIDDLE: Systematic Chat (2-Pane Layout) ── */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Aligned Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200">
                <Icons.Terminal size={14} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 tracking-tight">AI Engineering Mentor</h3>
                  <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100 animate-pulse">
                    <div className="w-1 h-1 rounded-full bg-green-600" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={() => setShowCodePanel(v => !v)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                  showCodePanel ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 shadow-sm'
                }`}>
                <Icons.Code size={13} /> {showCodePanel ? 'Hide Console' : 'Show Console'}
              </button>
            </div>
          </div>

          {/* Systematic Messages */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center max-w-sm mx-auto text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                  <Icons.Terminal size={32} className="text-slate-300" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg mb-2">How can we optimize your code today?</h4>
                <p className="text-sm text-slate-400 mb-8 leading-relaxed">Ask about architecture, debugging, or complex algorithm optimizations.</p>
                <div className="grid grid-cols-2 gap-2 w-full">
                  {SUGGESTION_CHIPS.slice(0, 4).map(chip => (
                    <button key={chip} onClick={() => send(chip)}
                      className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 rounded-xl text-[10px] font-bold text-slate-500 transition-all truncate">
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => <Message key={i} msg={msg} onRetry={() => handleRetry(i)} />)
            )}
            {sending && (
              <div className="flex gap-4 animate-in slide-in-from-bottom-2 duration-300">
                <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">AI</div>
                <div className="px-5 py-4 rounded-3xl rounded-tl-md bg-white border border-slate-200 shadow-sm">
                  <div className="flex gap-1.5 h-4 items-center">
                    {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} className="h-4" />
          </div>

          {/* Premium Input Bar */}
          <div className="px-6 py-4 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-blue-50 transition-all duration-300">
              <textarea className="flex-1 bg-transparent resize-none outline-none text-sm text-slate-700 placeholder:text-slate-400 py-2 custom-scrollbar"
                rows={1} style={{ minHeight: 40, maxHeight: 150 }}
                value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask about design patterns, performance, or debugging..."
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
              />
              <button onClick={() => send()} disabled={!input.trim() || sending}
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white flex items-center justify-center transition-all shadow-md active:scale-95">
                <Icons.ArrowRight size={18} />
              </button>
            </div>
            <p className="mt-2 text-[9px] text-center font-bold text-slate-400 uppercase tracking-widest">Powered by Groq Llama-3.3 · Systematic Analysis Mode</p>
          </div>
        </div>

        {/* ── RIGHT: Interactive Console Panel ── */}
        <CodePanel visible={showCodePanel} onClose={() => setShowCodePanel(false)} />
      </div>

      <QuotaModal isOpen={showQuotaModal} onClose={() => setShowQuotaModal(false)} />
    </>
  );
}

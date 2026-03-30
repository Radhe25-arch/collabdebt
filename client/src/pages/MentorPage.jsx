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

// ─── CODE EDITOR PANEL ─────────────────────────────────────
function CodePanel({ visible }) {
  const [code, setCode]       = useState('');
  const [language, setLang]   = useState('python');
  const [output, setOutput]   = useState('');
  const [running, setRunning] = useState(false);

  const runCode = async () => {
    if (!code.trim()) return;
    setRunning(true);
    setOutput('Running...');
    try {
      const r = await api.post('/code/execute', { code, language });
      setOutput(r.data.output || r.data.error || '// No output');
      if (r.data.error && r.data.output) {
        setOutput(r.data.output + '\n\n--- Errors ---\n' + r.data.error);
      }
    } catch (err) {
      // Fallback: client-side JS execution
      if (language === 'javascript') {
        try {
          const logs = [];
          const mock = { log: (...a) => logs.push(a.map(String).join(' ')), error: (...a) => logs.push('Error: ' + a.map(String).join(' ')), warn: (...a) => logs.push('Warn: ' + a.map(String).join(' ')) };
          new Function('console', code)(mock);
          setOutput(logs.join('\n') || '// No output');
        } catch (e) { setOutput(`Error: ${e.message}`); }
      } else {
        setOutput(`Error: Code execution service unavailable.\nTip: Make sure JUDGE0_URL and JUDGE0_KEY are set in your server environment variables.`);
      }
    }
    setRunning(false);
  };

  if (!visible) return null;

  return (
    <div className="w-[340px] flex-shrink-0 flex flex-col bg-white border-l border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Icons.Terminal size={13} className="text-slate-500" />
          <span className="font-mono text-[11px] text-slate-600 font-medium">Code Runner</span>
        </div>
        <button onClick={runCode} disabled={running || !code.trim()}
          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white px-3 py-1 rounded-md text-[11px] font-mono font-medium transition-colors">
          {running ? <Spinner size={10} /> : <Icons.Play size={10} />} Run
        </button>
      </div>

      {/* Language selector */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-100 overflow-x-auto">
        {LANGUAGES.map(l => (
          <button key={l.id} onClick={() => setLang(l.id)}
            className={`px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap transition-all ${
              language === l.id ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
            }`}>{l.label}</button>
        ))}
      </div>

      {/* Editor */}
      <textarea value={code} onChange={e => setCode(e.target.value)}
        className="flex-1 w-full bg-white resize-none outline-none p-4 font-mono text-xs text-slate-800 leading-relaxed border-b border-slate-100"
        placeholder={language === 'python' ? 'print("Hello, World!")' : language === 'javascript' ? 'console.log("Hello, World!")' : '// Write code here...'}
        spellCheck={false}
        style={{ fontFamily: "'JetBrains Mono', Consolas, monospace", minHeight: 200 }}
      />

      {/* Output */}
      <div className="flex-shrink-0 max-h-52 overflow-y-auto">
        <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100 sticky top-0">
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Output</span>
        </div>
        <pre className="p-4 text-xs font-mono text-slate-700 whitespace-pre-wrap bg-white min-h-[50px] leading-relaxed"
          style={{ fontFamily: "'JetBrains Mono', Consolas, monospace" }}>
          {output || `// Click "Run" to execute your ${language} code`}
        </pre>
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
  const [showCodePanel, setShowCodePanel] = useState(false);
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
        setMessages(m => m.filter(msg => msg.content !== text)); // Remove the failed user message
        setShowQuotaModal(true);
      } else {
        setMessages(m => [...m, { role: 'assistant', content: '', timestamp: new Date().toISOString(), error: true, originalText: text }]);
      }
    }
    setSending(false);
  }, [input, activeSession]);

  const handleRetry = (i) => { const m = messages[i]; if (m?.originalText) send(m.originalText, i); };

  // Filter for history search
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
      <div className="flex h-[calc(100vh-7rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* ── LEFT: Sessions Sidebar ── */}
        <div className="w-60 flex-shrink-0 flex flex-col border-r border-slate-100 bg-slate-50/50">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {['sessions', 'history'].map(t => (
              <button key={t} onClick={() => setSidebarTab(t)}
                className={`flex-1 py-2.5 text-[11px] font-mono capitalize transition-all ${
                  sidebarTab === t ? 'text-blue-700 border-b-2 border-blue-600 bg-white' : 'text-slate-400 hover:text-slate-600'
                }`}>{t}</button>
            ))}
          </div>

          {/* New Session */}
          <div className="p-3">
            <button onClick={newSession}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-mono font-medium transition-colors">
              <Icons.Plus size={11} /> New Chat
            </button>
          </div>

          {/* Session/History Lists */}
          <div className="flex-1 overflow-y-auto px-2 pb-3">
            {sidebarTab === 'history' && (
              <div className="px-1 mb-2">
                <div className="relative">
                  <Icons.Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input className="w-full bg-white border border-slate-200 rounded-md py-1.5 pl-7 pr-2 text-[11px] font-mono outline-none focus:border-blue-400 placeholder:text-slate-400"
                    placeholder="Search..." value={historySearch} onChange={e => setHistorySearch(e.target.value)} />
                </div>
              </div>
            )}

            {sidebarTab === 'sessions' ? (
              sessions.length === 0
                ? <p className="text-center text-[11px] font-mono text-slate-400 py-6">No sessions yet</p>
                : <div className="space-y-0.5">
                    {sessions.map(s => (
                      <button key={s.id} onClick={() => selectSession(s)}
                        className={`w-full text-left px-3 py-2 rounded-lg group flex items-center gap-2 transition-all ${
                          activeSession?.id === s.id ? 'bg-white border border-blue-200 shadow-sm' : 'hover:bg-white border border-transparent'
                        }`}>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-slate-800 truncate">{s.topic || 'Session'}</p>
                          <p className="text-[10px] font-mono text-slate-400">{Array.isArray(s.messages) ? s.messages.length : 0} msgs</p>
                        </div>
                        <button onClick={(e) => deleteSession(s.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all p-0.5">
                          <Icons.X size={10} />
                        </button>
                      </button>
                    ))}
                  </div>
            ) : (
              Object.entries(groupedHistory).length === 0
                ? <p className="text-center text-[11px] font-mono text-slate-400 py-6">No sessions found</p>
                : Object.entries(groupedHistory).map(([date, items]) => (
                    <div key={date} className="mb-2.5">
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 px-2">{date}</p>
                      <div className="space-y-0.5">
                        {items.map(s => (
                          <button key={s.id} onClick={() => selectSession(s)}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] transition-all ${
                              activeSession?.id === s.id ? 'bg-white border border-blue-200' : 'hover:bg-white border border-transparent'
                            }`}>
                            <p className="text-slate-700 truncate">{s.topic || 'Session'}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
            )}
          </div>
        </div>

        {/* ── MIDDLE: Chat ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-100 bg-white flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
                <Icons.Terminal size={13} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">AI Mentor</p>
                <p className="text-[10px] text-slate-400 font-mono">Senior engineer · Code reviews · DSA · System design</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowCodePanel(v => !v)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono border transition-all ${
                  showCodePanel ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:text-slate-700'
                }`}>
                <Icons.Code size={12} /> {showCodePanel ? 'Hide' : 'Code'}
              </button>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-mono text-green-600">Online</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0 bg-slate-50/30">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-5 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center">
                  <Icons.Terminal size={20} className="text-white" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-base text-slate-900 mb-1">How can I help you today?</p>
                  <p className="text-xs text-slate-500">Code reviews, debugging, DSA problems, interview prep, system design</p>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {SUGGESTION_CHIPS.map(chip => (
                    <button key={chip} onClick={() => send(chip)}
                      className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 text-[11px] transition-all">
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => <Message key={i} msg={msg} onRetry={() => handleRetry(i)} />)}
            {sending && (
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-[10px] font-mono font-bold text-white mt-0.5">AI</div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-1">{[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}</div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 border-t border-slate-100 bg-white p-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
              <textarea className="flex-1 bg-transparent resize-none outline-none text-sm text-slate-700 placeholder:text-slate-400 py-1.5"
                rows={1} style={{ minHeight: 32, maxHeight: 100 }}
                value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask about code, algorithms, debugging..."
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'; }}
              />
              <button onClick={() => send()} disabled={!input.trim() || sending}
                className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-30 flex items-center justify-center text-white flex-shrink-0 transition-colors">
                <Icons.ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Code Panel ── */}
        <CodePanel visible={showCodePanel} />
      </div>
      
      <QuotaModal isOpen={showQuotaModal} onClose={() => setShowQuotaModal(false)} />
    </>
  );
}

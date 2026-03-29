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
  'Debug this async function',
  'Explain recursion with examples',
  'What is the event loop?',
  'How do React hooks work?',
  'Explain promises vs async/await',
];

// ─── MARKDOWN RENDERER ────────────────────────────────────
function MsgContent({ content }) {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const lines   = part.split('\n');
          const lang    = lines[0].replace('```', '').trim() || 'code';
          const code    = lines.slice(1, -1).join('\n');
          return (
            <div key={i} className="relative group">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 rounded-t-lg border border-slate-200 border-b-0">
                <span className="font-mono text-xs text-slate-500">{lang}</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(code); toast.success('Copied'); }}
                  className="font-mono text-xs text-slate-500 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  copy
                </button>
              </div>
              <pre className="bg-slate-50 border border-slate-200 rounded-b-lg p-3 overflow-x-auto text-xs font-mono text-slate-600 leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        const rendered = part
          .split(/(\*\*.*?\*\*|`.*?`)/g)
          .map((chunk, ci) => {
            if (chunk.startsWith('**') && chunk.endsWith('**'))
              return <strong key={ci} className="text-slate-900 font-semibold">{chunk.slice(2,-2)}</strong>;
            if (chunk.startsWith('`') && chunk.endsWith('`'))
              return <code key={ci} className="font-mono text-xs bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-indigo-600">{chunk.slice(1,-1)}</code>;
            return <span key={ci}>{chunk}</span>;
          });

        return (
          <div key={i} className="text-sm leading-relaxed whitespace-pre-wrap">
            {rendered}
          </div>
        );
      })}
    </div>
  );
}

// ─── MESSAGE BUBBLE ────────────────────────────────────────
function Message({ msg, onRetry }) {
  const isUser  = msg.role === 'user';
  const isError = msg.error;

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-mono text-xs font-bold ${
        isUser ? 'bg-blue-600 text-white' : isError ? 'bg-red-100 border border-red-300 text-red-500' : 'bg-indigo-600/20 border border-indigo-600/30 text-indigo-600'
      }`}>
        {isUser ? 'U' : isError ? '!' : 'AI'}
      </div>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-xl text-slate-900 ${
          isError
            ? 'bg-red-50 border border-red-200 rounded-tl-sm'
            : isUser
            ? 'bg-blue-600/20 border border-blue-600/30 rounded-tr-sm'
            : 'bg-white border border-slate-200 rounded-tl-sm'
        }`}>
          {isError ? (
            <div className="space-y-2">
              <p className="text-sm text-red-600">Failed to get response. The AI service may be temporarily unavailable.</p>
              <button
                onClick={onRetry}
                className="flex items-center gap-1.5 text-xs font-mono text-red-600 hover:text-red-700 bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Icons.ArrowRight size={11} /> Retry
              </button>
            </div>
          ) : (
            <MsgContent content={msg.content} />
          )}
        </div>
        <span className="font-mono text-xs text-slate-500 px-1">
          {msg.timestamp ? format(new Date(msg.timestamp), 'HH:mm') : ''}
        </span>
      </div>
    </div>
  );
}

// ─── CODE PANEL ───────────────────────────────────────────
function CodePanel({ code, setCode, output, onRun, running }) {
  return (
    <div className="w-80 flex-shrink-0 flex flex-col border-l border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Code Compiler</span>
        <button
          onClick={onRun}
          disabled={running || !code.trim()}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg text-xs font-mono transition-colors"
        >
          {running ? <Spinner size={11} /> : <Icons.Play size={11} />}
          Run
        </button>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          className="flex-1 w-full bg-slate-50 resize-none outline-none p-4 font-mono text-xs text-slate-800 leading-relaxed border-b border-slate-200"
          placeholder="// Write or paste code here to run..."
          spellCheck={false}
          style={{ fontFamily: "'JetBrains Mono', Consolas, monospace", minHeight: 180 }}
        />
        <div className="flex-shrink-0 max-h-48 overflow-y-auto">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
            <span className="font-mono text-xs text-slate-500">Output</span>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-700 whitespace-pre-wrap bg-white min-h-[60px]">
            {output || '// Run your code to see output here'}
          </pre>
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
  const [attachCode, setAttachCode]   = useState('');
  const [showAttach, setShowAttach]   = useState(false);
  const [sending, setSending]         = useState(false);
  const [loading, setLoading]         = useState(true);
  const [sidebarTab, setSidebarTab]   = useState('sessions');
  const [historySearch, setHistorySearch] = useState('');
  const [showCodePanel, setShowCodePanel] = useState(false);
  const [compilerCode, setCompilerCode]   = useState('');
  const [compilerOutput, setCompilerOutput] = useState('');
  const [runningCode, setRunningCode]     = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get('/mentor').then(r => {
      const s = r.data.sessions || [];
      setSessions(s);
      const first = s[0];
      if (first) { setActive(first); setMessages(Array.isArray(first.messages) ? first.messages : []); }
    }).catch(() => {
      // Graceful fallback if mentor endpoint fails
      setSessions([]);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const newSession = async () => {
    try {
      const r = await api.post('/mentor/sessions', { topic: 'New Session' });
      setSessions(s => [r.data.session, ...s]);
      setActive(r.data.session);
      setMessages([]);
      setSidebarTab('sessions');
    } catch {
      toast.error('Failed to create session');
    }
  };

  const selectSession = (s) => {
    setActive(s);
    setMessages(Array.isArray(s.messages) ? s.messages : []);
    setSidebarTab('sessions');
  };

  const deleteSession = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/mentor/sessions/${id}`);
      setSessions(s => s.filter(x => x.id !== id));
      if (activeSession?.id === id) { setActive(null); setMessages([]); }
    } catch {
      toast.error('Failed to delete session');
    }
  };

  const send = useCallback(async (msgText, retryIndex) => {
    const text = (msgText || input).trim();
    if (!text && !attachCode) return;

    let sessionId = activeSession?.id;
    if (!sessionId) {
      try {
        const r = await api.post('/mentor/sessions', { topic: text.slice(0, 40) });
        setSessions(s => [r.data.session, ...s]);
        setActive(r.data.session);
        sessionId = r.data.session.id;
      } catch {
        toast.error('Failed to create session');
        return;
      }
    }

    const userContent = attachCode ? `${text}\n\n\`\`\`\n${attachCode}\n\`\`\`` : text;

    // If retrying, remove the error message first
    if (retryIndex != null) {
      setMessages(m => m.filter((_, i) => i !== retryIndex));
    } else {
      const userMsg = { role: 'user', content: userContent, timestamp: new Date().toISOString() };
      setMessages(m => [...m, userMsg]);
    }

    setInput('');
    setAttachCode('');
    setShowAttach(false);
    setSending(true);

    try {
      const r = await api.post(`/mentor/sessions/${sessionId}/message`, { message: text, code: attachCode || undefined });
      const aiMsg = { role: 'assistant', content: r.data.response, timestamp: new Date().toISOString() };
      setMessages(m => [...m, aiMsg]);

      setSessions(s => s.map(x =>
        x.id === sessionId
          ? { ...x, messages: [...(Array.isArray(x.messages) ? x.messages : []), { role: 'user', content: userContent }, aiMsg] }
          : x
      ));
    } catch {
      // Add inline error message instead of just a toast
      const errorMsg = { role: 'assistant', content: '', timestamp: new Date().toISOString(), error: true, originalText: text, originalCode: attachCode };
      setMessages(m => [...m, errorMsg]);
    }
    setSending(false);
  }, [input, attachCode, activeSession]);

  const handleRetry = (index) => {
    const errorMsg = messages[index];
    if (errorMsg?.originalText) {
      send(errorMsg.originalText, index);
    }
  };

  const runCode = async () => {
    if (!compilerCode.trim()) return;
    setRunningCode(true);
    try {
      // Use Function constructor for simple JS execution (client-side)
      const logs = [];
      const mockConsole = { log: (...args) => logs.push(args.map(String).join(' ')), error: (...args) => logs.push('Error: ' + args.map(String).join(' ')), warn: (...args) => logs.push('Warn: ' + args.map(String).join(' ')) };
      const fn = new Function('console', compilerCode);
      fn(mockConsole);
      setCompilerOutput(logs.join('\n') || '// No output');
    } catch (err) {
      setCompilerOutput(`Error: ${err.message}`);
    }
    setRunningCode(false);
  };

  // Filter sessions for history search
  const filteredSessions = historySearch
    ? sessions.filter(s => (s.topic || '').toLowerCase().includes(historySearch.toLowerCase()))
    : sessions;

  // Group sessions by date for history
  const groupedHistory = {};
  filteredSessions.forEach(s => {
    const date = s.updatedAt ? format(new Date(s.updatedAt), 'MMM d, yyyy') : 'Unknown';
    if (!groupedHistory[date]) groupedHistory[date] = [];
    groupedHistory[date].push(s);
  });

  if (loading) return (
    <div className="flex justify-center py-24"><Spinner size={24} className="text-blue-700" /></div>
  );

  return (
    <div className="flex gap-0 h-[calc(100vh-7rem)] overflow-hidden">
      {/* Sidebar — sessions & history */}
      <div className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 overflow-hidden">
        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 flex-shrink-0">
          {['sessions', 'history'].map(t => (
            <button key={t} onClick={() => setSidebarTab(t)}
              className={`flex-1 py-3 font-mono text-xs capitalize transition-all ${
                sidebarTab === t ? 'text-blue-700 border-b-2 border-blue-600 bg-blue-50/40' : 'text-slate-500 hover:text-slate-900'
              }`}
            >{t}</button>
          ))}
        </div>

        <div className="p-3 flex-shrink-0">
          <Button onClick={newSession} variant="primary" size="sm" className="w-full">
            <Icons.Plus size={13} /> New Session
          </Button>
        </div>

        {/* Sessions list */}
        {sidebarTab === 'sessions' && (
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
            {sessions.length === 0 && (
              <p className="font-mono text-xs text-slate-500 text-center py-4">No sessions yet</p>
            )}
            {sessions.map(s => (
              <button
                key={s.id}
                onClick={() => selectSession(s)}
                className={`w-full text-left px-3 py-2.5 rounded-lg group flex items-center gap-2 transition-colors ${
                  activeSession?.id === s.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Icons.Terminal size={12} className="text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-slate-900 truncate">{s.topic || 'Session'}</p>
                  <p className="font-mono text-xs text-slate-400">
                    {Array.isArray(s.messages) ? s.messages.length : 0} msgs
                  </p>
                </div>
                <button
                  onClick={(e) => deleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all p-0.5"
                >
                  <Icons.X size={11} />
                </button>
              </button>
            ))}
          </div>
        )}

        {/* History tab */}
        {sidebarTab === 'history' && (
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <div className="relative mb-3">
              <Icons.Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pl-8 text-xs font-mono text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-400 transition-colors"
                placeholder="Search sessions..."
                value={historySearch}
                onChange={e => setHistorySearch(e.target.value)}
              />
            </div>
            {Object.entries(groupedHistory).length === 0 && (
              <p className="font-mono text-xs text-slate-500 text-center py-4">No sessions found</p>
            )}
            {Object.entries(groupedHistory).map(([date, items]) => (
              <div key={date} className="mb-3">
                <p className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-1.5 px-1">{date}</p>
                <div className="space-y-1">
                  {items.map(s => (
                    <button
                      key={s.id}
                      onClick={() => selectSession(s)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSession?.id === s.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <p className="font-mono text-xs text-slate-800 truncate">{s.topic || 'Session'}</p>
                      <p className="font-mono text-xs text-slate-400">
                        {Array.isArray(s.messages) ? s.messages.length : 0} messages
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/15 border border-indigo-600/20 flex items-center justify-center">
              <Icons.Terminal size={14} className="text-indigo-600" />
            </div>
            <div>
              <p className="font-display font-bold text-sm">AI Code Mentor</p>
              <p className="font-mono text-xs text-slate-500">Senior engineer · always available</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCodePanel(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                showCodePanel ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icons.Code size={12} /> Compiler
            </button>
            <BadgeTag variant="teal">Online</BadgeTag>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 min-h-0">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/15 border border-indigo-600/20 flex items-center justify-center">
                <Icons.Terminal size={24} className="text-indigo-600" />
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-base mb-2">Ask me anything about code</p>
                <p className="font-mono text-xs text-slate-500 max-w-xs">
                  Code review, debugging, concepts, DSA problems, interview prep — I'm here 24/7
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {SUGGESTION_CHIPS.map(chip => (
                  <button
                    key={chip}
                    onClick={() => send(chip)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 font-mono text-xs transition-all cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} onRetry={() => handleRetry(i)} />
          ))}
          {sending && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center text-indigo-600 font-mono text-xs font-bold">AI</div>
              <div className="px-4 py-3 rounded-xl rounded-tl-sm bg-white border border-slate-200">
                <div className="flex items-center gap-1.5">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 border-t border-slate-200 bg-white">
          {showAttach && (
            <div className="px-4 pt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs text-slate-500">Code to review (optional)</span>
                <button onClick={() => setShowAttach(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                  <Icons.X size={12} />
                </button>
              </div>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs text-slate-700 resize-none outline-none focus:border-blue-400 transition-colors"
                rows={4}
                value={attachCode}
                onChange={e => setAttachCode(e.target.value)}
                placeholder="// Paste your code here..."
                spellCheck={false}
              />
            </div>
          )}
          <div className="flex items-end gap-2 p-4">
            <button
              onClick={() => setShowAttach(v => !v)}
              className={`flex-shrink-0 p-2.5 rounded-lg border transition-colors ${
                showAttach ? 'border-blue-300 text-blue-700 bg-blue-50' : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300'
              }`}
              title="Attach code"
            >
              <Icons.Code size={14} />
            </button>
            <div className="flex-1 relative">
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 resize-none pr-12 outline-none focus:border-blue-400 transition-colors placeholder:text-slate-400"
                rows={1}
                style={{ minHeight: 42, maxHeight: 120 }}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about code, algorithms, debugging..."
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
                }}
                onInput={e => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
              />
            </div>
            <Button onClick={() => send()} variant="primary" size="sm" loading={sending} disabled={!input.trim() && !attachCode}>
              <Icons.ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Code Compiler Panel */}
      {showCodePanel && (
        <CodePanel
          code={compilerCode}
          setCode={setCompilerCode}
          output={compilerOutput}
          onRun={runCode}
          running={runningCode}
        />
      )}
    </div>
  );
}

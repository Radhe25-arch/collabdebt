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
  // Split content into code blocks and text
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

        // Render text with bold/inline-code
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
function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-mono text-xs font-bold ${
        isUser ? 'bg-blue-600 text-white' : 'bg-indigo-600/20 border border-indigo-600/30 text-indigo-600'
      }`}>
        {isUser ? 'U' : 'AI'}
      </div>
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-xl text-slate-900 ${
          isUser
            ? 'bg-blue-600/20 border border-blue-600/30 rounded-tr-sm'
            : 'bg-white border border-slate-200 rounded-tl-sm'
        }`}>
          <MsgContent content={msg.content} />
        </div>
        <span className="font-mono text-xs text-slate-500 px-1">
          {msg.timestamp ? format(new Date(msg.timestamp), 'HH:mm') : ''}
        </span>
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
  const [code, setCode]               = useState('');
  const [showCode, setShowCode]       = useState(false);
  const [sending, setSending]         = useState(false);
  const [loading, setLoading]         = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get('/mentor').then(r => {
      setSessions(r.data.sessions || []);
      const first = r.data.sessions?.[0];
      if (first) { setActive(first); setMessages(Array.isArray(first.messages) ? first.messages : []); }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const newSession = async () => {
    const r = await api.post('/mentor/sessions', { topic: 'New Session' });
    setSessions(s => [r.data.session, ...s]);
    setActive(r.data.session);
    setMessages([]);
  };

  const selectSession = (s) => {
    setActive(s);
    setMessages(Array.isArray(s.messages) ? s.messages : []);
  };

  const deleteSession = async (id, e) => {
    e.stopPropagation();
    await api.delete(`/mentor/sessions/${id}`);
    setSessions(s => s.filter(x => x.id !== id));
    if (activeSession?.id === id) { setActive(null); setMessages([]); }
  };

  const send = useCallback(async (msgText) => {
    const text = (msgText || input).trim();
    if (!text) return;

    let sessionId = activeSession?.id;
    if (!sessionId) {
      const r = await api.post('/mentor/sessions', { topic: text.slice(0, 40) });
      setSessions(s => [r.data.session, ...s]);
      setActive(r.data.session);
      sessionId = r.data.session.id;
    }

    const userMsg = { role: 'user', content: code ? `${text}\n\n\`\`\`\n${code}\n\`\`\`` : text, timestamp: new Date().toISOString() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setCode('');
    setShowCode(false);
    setSending(true);

    try {
      const r = await api.post(`/mentor/sessions/${sessionId}/message`, { message: text, code: code || undefined });
      const aiMsg = { role: 'assistant', content: r.data.response, timestamp: new Date().toISOString() };
      setMessages(m => [...m, aiMsg]);

      // Update session in list
      setSessions(s => s.map(x =>
        x.id === sessionId
          ? { ...x, messages: [...(Array.isArray(x.messages) ? x.messages : []), userMsg, aiMsg] }
          : x
      ));
    } catch (_) {
      toast.error('Failed to get response');
    }
    setSending(false);
  }, [input, code, activeSession]);

  if (loading) return (
    <div className="flex justify-center py-24"><Spinner size={24} className="text-blue-700" /></div>
  );

  return (
    <div className="flex gap-5 h-[calc(100vh-7rem)]">
      {/* Sidebar — sessions */}
      <div className="w-56 flex-shrink-0 flex flex-col gap-3">
        <Button onClick={newSession} variant="primary" size="sm" className="w-full">
          <Icons.Plus size={13} /> New Session
        </Button>

        <div className="flex-1 overflow-y-auto space-y-1">
          {sessions.length === 0 && (
            <p className="font-mono text-xs text-slate-500 text-center py-4">No sessions yet</p>
          )}
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => selectSession(s)}
              className={`w-full text-left px-3 py-2.5 rounded-lg group flex items-center gap-2 transition-colors ${
                activeSession?.id === s.id
                  ? 'bg-blue-600/15 border border-slate-200'
                  : 'hover:bg-slate-100'
              }`}
            >
              <Icons.Shield size={12} className="text-slate-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs text-slate-900 truncate">{s.topic || 'Session'}</p>
                <p className="font-mono text-xs text-slate-500">
                  {Array.isArray(s.messages) ? s.messages.length : 0} msgs
                </p>
              </div>
              <button
                onClick={(e) => deleteSession(s.id, e)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
              >
                <Icons.XIcon size={11} />
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col arena-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/15 border border-indigo-600/20 flex items-center justify-center">
              <Icons.Shield size={14} className="text-indigo-600" />
            </div>
            <div>
              <p className="font-display font-bold text-sm">AI Code Mentor</p>
              <p className="font-mono text-xs text-slate-500">Senior engineer · always available</p>
            </div>
          </div>
          <BadgeTag variant="teal">Online</BadgeTag>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/15 border border-indigo-600/20 flex items-center justify-center">
                <Icons.Shield size={24} className="text-indigo-600" />
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
                    className="badge-tag badge-gray hover:badge-purple font-mono text-xs transition-all cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => <Message key={i} msg={msg} />)}
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
        <div className="flex-shrink-0 border-t border-slate-200">
          {showCode && (
            <div className="px-4 pt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs text-slate-500">Code to review (optional)</span>
                <button onClick={() => setShowCode(false)} className="text-slate-500 hover:text-slate-900">
                  <Icons.XIcon size={12} />
                </button>
              </div>
              <textarea
                className="w-full w-full bg-white border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-blue-500 transition-all text-sm font-mono text-xs resize-none"
                rows={5}
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="// Paste your code here..."
                spellCheck={false}
              />
            </div>
          )}
          <div className="flex items-end gap-2 p-4">
            <button
              onClick={() => setShowCode(v => !v)}
              className={`flex-shrink-0 p-2.5 rounded-lg border transition-colors ${
                showCode ? 'border-indigo-600/40 text-indigo-600 bg-indigo-600/10' : 'border-slate-200 text-slate-500 hover:text-slate-900'
              }`}
              title="Attach code"
            >
              <Icons.Code size={14} />
            </button>
            <div className="flex-1 relative">
              <textarea
                className="w-full w-full bg-white border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-blue-500 transition-all text-sm text-sm resize-none pr-12"
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
            <Button onClick={() => send()} variant="teal" size="sm" loading={sending} disabled={!input.trim() && !code}>
              <Icons.ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

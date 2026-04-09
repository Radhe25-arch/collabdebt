import { useState, useEffect, useRef, useCallback } from 'react';
import { Spinner } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const SUGGESTION_CHIPS = [
  'Explain closures in JavaScript',
  'Code review: identify bugs',
  'Big O notation visually',
  'Optimize this algorithm',
];

const MODES = [
  { id: 'tutor', label: 'Tutor Base' },
  { id: 'dev',   label: 'Senior Dev' },
];

function TypingIndicator() {
  return (
    <div className="flex gap-4 fade-in">
      <div className="w-8 h-8 rounded-[4px] border border-cyber/30 bg-cyber/[0.08] flex items-center justify-center text-[9px] font-bold text-cyber tracking-widest uppercase">AI</div>
      <div className="px-5 py-4 rounded-[4px] bg-black border border-white/[0.08] flex items-center justify-center">
        <div className="flex gap-1.5 h-2 items-center">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-[1px] bg-[#555] animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MsgContent({ content }) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-4">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const lines = part.split('\n');
          const lang  = lines[0].replace('```', '').trim() || 'code';
          const code  = lines.slice(1, -1).join('\n');
          return (
            <div key={i} className="relative group rounded-[4px] overflow-hidden border border-white/[0.08]">
              <div className="flex items-center justify-between px-4 py-2 bg-[rgba(255,255,255,0.02)] border-b border-white/[0.06]">
                <span className="font-mono text-[10px] text-[#555] uppercase tracking-widest font-bold">{lang}</span>
                <button onClick={() => { navigator.clipboard.writeText(code); toast.success('COPIED'); }}
                  className="font-mono text-[10px] text-[#555] hover:text-white opacity-0 group-hover:opacity-100 transition-all uppercase font-bold tracking-wider">COPY</button>
              </div>
              <pre className="bg-black p-4 overflow-x-auto text-[13px] font-mono text-[#E0E0E0] leading-relaxed custom-scrollbar"><code>{code}</code></pre>
            </div>
          );
        }
        const rendered = part.split(/(\*\*.*?\*\*|`.*?`)/g).map((chunk, ci) => {
          if (chunk.startsWith('**') && chunk.endsWith('**')) return <strong key={ci} className="font-bold text-white">{chunk.slice(2,-2)}</strong>;
          if (chunk.startsWith('`') && chunk.endsWith('`')) return <code key={ci} className="font-mono text-[12px] font-bold bg-[#111] border border-white/[0.08] px-1.5 py-0.5 rounded-[2px] text-cyber">{chunk.slice(1,-1)}</code>;
          return <span key={ci}>{chunk}</span>;
        });
        return <div key={i} className="text-[14px] leading-[1.7] whitespace-pre-wrap text-[#B0B0B0] font-sans">{rendered}</div>;
      })}
    </div>
  );
}

function Message({ msg, onRetry }) {
  const isUser  = msg.role === 'user';
  const isError = msg.error;

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''} group fade-in`}>
      <div className={`w-8 h-8 rounded-[4px] border flex-shrink-0 flex items-center justify-center text-[9px] font-bold tracking-widest ${
        isUser ? 'border-white/20 bg-white/10 text-white' : isError ? 'border-crimson/30 bg-crimson/10 text-crimson' : 'border-cyber/30 bg-cyber/[0.08] text-cyber'
      }`}>
        {isUser ? 'US' : isError ? '!' : 'AI'}
      </div>
      <div className={`max-w-[80%] flex flex-col gap-1.5 ${isUser ? 'items-end' : ''}`}>
        <div className={`px-5 py-4 rounded-[4px] border ${
          isError ? 'bg-crimson/10 border-crimson/30 text-crimson'
            : isUser ? 'bg-[#111] border-white/[0.08] text-white'
            : 'bg-black border-white/[0.08] shadow-sm'
        }`}>
          {isError ? (
            <div className="space-y-2">
              <p className="text-sm font-bold">Connection Terminated</p>
              <button onClick={onRetry} className="text-[11px] font-bold uppercase underline">Retry Call</button>
            </div>
          ) : isUser ? (
            <div className="text-[14px] leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</div>
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4 fade-in">
      <div className="bg-[#050505] border border-white/[0.08] p-8 rounded-[4px] max-w-sm w-full text-center shadow-2xl">
        <Icons.Zap size={32} className="text-cyber mx-auto mb-4" />
        <h3 className="text-lg font-mono font-black tracking-tight text-white uppercase mb-2">Request Limit Reached</h3>
        <p className="text-sm font-mono text-[#666] mb-6">Your daily quota is full. Resources reallocate at 12:00 UTC.</p>
        <button onClick={onClose} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] font-mono uppercase tracking-[0.2em] transition-all rounded-[4px]">Acknowledge</button>
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
      const r = await api.post('/mentor/sessions', { topic: 'New Discussion' });
      setSessions(s => [r.data.session, ...s]);
      setActive(r.data.session);
      setMessages([]);
      toast.success('Session Generated');
    } catch { toast.error('Creation Failed'); }
  };

  const selectSession = (s) => { setActive(s); setMessages(Array.isArray(s.messages) ? s.messages : []); };

  const deleteSession = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/mentor/sessions/${id}`);
      setSessions(s => s.filter(x => x.id !== id));
      if (activeSession?.id === id) { setActive(null); setMessages([]); }
    } catch { toast.error('Termination Failed'); }
  };

  const clearChat = () => { if(window.confirm('Clear session memory?')) setMessages([]); };

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
        if (err.response?.data?.error === 'DAILY_LIMIT_REACHED') { setShowQuotaModal(true); return; }
        toast.error('Session Init Failed'); return; 
      }
    }

    if (retryIndex != null) setMessages(m => m.filter((_, i) => i !== retryIndex));
    else setMessages(m => [...m, { role: 'user', content: text, timestamp: new Date().toISOString() }]);

    setInput(''); setSending(true);

    try {
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

  if (loading) return <div className="flex justify-center py-32"><Spinner size={24} className="text-slate-400" /></div>;

  return (
    <>
      <div className="flex h-[calc(100vh-7rem)] overflow-hidden rounded-[4px] border border-white/[0.08] bg-black shadow-sm">
        {/* ── LEFT: Minimal Sidebar ── */}
        <div className="w-64 flex-shrink-0 flex flex-col border-r border-white/[0.08] bg-[#050505]">
          <div className="p-4 border-b border-white/[0.08]">
            <button onClick={newSession} className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-[4px] bg-white/[0.02] border border-white/[0.06] text-white font-mono uppercase text-[10px] font-black hover:bg-white/[0.06] hover:border-white/[0.1] transition-all">
              NEW OPERATION <Icons.Plus size={12} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {sessions.map(s => (
              <button key={s.id} onClick={() => selectSession(s)}
                className={`w-full text-left p-3 rounded-[4px] group flex flex-col gap-1 transition-all relative ${
                  activeSession?.id === s.id ? 'bg-[#111] border border-white/[0.1] shadow-sm' : 'border border-transparent hover:bg-white/[0.02]'
                }`}>
                <div className="flex justify-between items-start w-full gap-2">
                   <p className="font-mono text-[10px] uppercase font-black text-white truncate">{s.topic || 'SESSION'}</p>
                   {activeSession?.id === s.id && (
                     <span onClick={(e) => deleteSession(s.id, e)} className="text-[#555] hover:text-crimson/80 transition-colors p-0.5"><Icons.X size={12}/></span>
                   )}
                </div>
                <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#555]">{Array.isArray(s.messages) ? s.messages.length : 0} EXCHANGES</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── MIDDLE: Clean Chat Area ── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#020202] relative">
          {/* Top Bar - Clean */}
          <div className="h-14 flex items-center justify-between px-6 border-b border-white/[0.08] bg-[#020202]/90 backdrop-blur-md z-10 sticky top-0">
             <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-emerald animate-pulse shadow-sm" />
                <h3 className="font-mono text-[12px] font-black text-white uppercase tracking-[0.2em]">LOGIC_HUB AI</h3>
             </div>
             
             <div className="flex items-center gap-4">
                <div className="flex bg-[#0A0A0A] rounded-[4px] p-0.5 border border-white/[0.06]">
                  {MODES.map(m => (
                    <button key={m.id} onClick={() => setActiveMode(m.id)}
                      className={`px-3 py-1 rounded-[2px] font-mono text-[9px] font-bold uppercase tracking-widest transition-all ${activeMode === m.id ? 'bg-white/10 text-white' : 'text-[#666] hover:text-white hover:bg-white/[0.02]'}`}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center max-w-sm mx-auto text-center">
                <div className="w-12 h-12 rounded-[4px] border border-cyber/30 bg-cyber/[0.08] flex items-center justify-center mb-6">
                  <Icons.Zap size={20} className="text-cyber" />
                </div>
                <h4 className="font-mono font-black text-white tracking-[0.2em] text-sm uppercase mb-2">SYSTEM READY</h4>
                <p className="font-mono text-[11px] text-[#888] mb-8 leading-relaxed">Ask architectural questions, request code reviews, or debug complex algorithms.</p>
                <div className="flex flex-wrap justify-center gap-2 w-full">
                  {SUGGESTION_CHIPS.map(chip => (
                    <button key={chip} onClick={() => send(chip)}
                      className="px-4 py-2 border border-white/[0.08] bg-black hover:border-white/[0.15] hover:bg-white/[0.02] rounded-[4px] text-[10px] font-bold font-mono text-[#888] hover:text-white transition-all">
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-center -mt-2 mb-6">
                  <button onClick={clearChat} className="flex items-center gap-1.5 text-[9px] font-bold font-mono uppercase tracking-[0.2em] text-[#444] hover:text-[#888] transition-colors">
                    <Icons.RefreshCw size={10} /> RESET CONTEXT
                  </button>
                </div>
                {messages.map((msg, i) => <Message key={i} msg={msg} onRetry={() => handleRetry(i)} />)}
              </>
            )}
            {sending && <TypingIndicator />}
            <div ref={bottomRef} className="h-4" />
          </div>

          {/* Minimal Input Area */}
          <div className="p-6 pt-2 bg-[#020202] sticky bottom-0 border-t border-white/[0.04]">
            <div className="flex items-end gap-2 bg-black border border-white/[0.12] rounded-[4px] px-4 py-2 shadow-sm focus-within:border-cyber/50 transition-all group">
              <textarea className="flex-1 bg-transparent resize-none outline-none text-[13px] font-mono text-[#E0E0E0] placeholder:text-[#555] py-2 custom-scrollbar"
                rows={1} style={{ minHeight: 34, maxHeight: 150, lineHeight: 1.5 }}
                value={input} onChange={e => setInput(e.target.value)}
                placeholder="INPUT QUERY..."
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
              />
              <button onClick={() => send()} disabled={!input.trim() || sending}
                className="w-8 h-8 mb-0.5 rounded-[4px] border border-cyber/30 bg-cyber/[0.08] hover:bg-cyber/[0.15] disabled:opacity-30 text-cyber flex-shrink-0 flex items-center justify-center transition-all">
                {sending ? <Spinner size={12} className="text-cyber" /> : <Icons.ArrowRight size={12} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <QuotaModal isOpen={showQuotaModal} onClose={() => setShowQuotaModal(false)} />
      
      <style dangerouslySetInnerHTML={{ __html: `
        .fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Spinner, BadgeTag } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const POWER_UPS = [
  { id: 'optimize', label: 'Optimize', icon: Icons.Zap, prompt: 'Analyze this code and suggest performance optimizations with specific focus on time/space complexity.' },
  { id: 'debug',    label: 'Identify Bugs', icon: Icons.Search, prompt: 'Find potential logic errors, race conditions, or edge cases in this code snippet.' },
  { id: 'refactor', label: 'Clean Code', icon: Icons.Award, prompt: 'Refactor this code to follow SOLID principles and improve maintainability.' },
  { id: 'explain',  label: 'Line-by-Line', icon: Icons.Book, prompt: 'Give me a deep-dive, line-by-line explanation of how this architecture works.' },
];

function MsgContent({ content }) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-3">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const lines   = part.split('\n');
          const lang    = lines[0].replace('```', '').trim() || 'code';
          const code    = lines.slice(1, -1).join('\n');
          return (
            <div key={i} className="relative group my-2">
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#050505] rounded-t-lg border border-white/5 border-b-0">
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">{lang}</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(code); toast.success('Copied to Clipboard'); }}
                  className="font-mono text-[10px] text-arena-teal opacity-0 group-hover:opacity-100 transition-opacity"
                >copy</button>
              </div>
              <pre className="bg-[#050505] border border-white/5 rounded-b-lg p-4 overflow-x-auto text-[11px] font-mono text-white/70 leading-relaxed shadow-inner">
                <code>{code}</code>
              </pre>
            </div>
          );
        }
        const rendered = part.split(/(\*\*.*?\*\*|`.*?`)/g).map((chunk, ci) => {
          if (chunk.startsWith('**') && chunk.endsWith('**'))
            return <strong key={ci} className="text-white font-semibold">{chunk.slice(2,-2)}</strong>;
          if (chunk.startsWith('`') && chunk.endsWith('`'))
            return <code key={ci} className="font-mono text-[11px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-arena-teal">{chunk.slice(1,-1)}</code>;
          return <span key={ci}>{chunk}</span>;
        });
        return <div key={i} className="text-[13px] leading-relaxed whitespace-pre-wrap text-white/80">{rendered}</div>;
      })}
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in`}>
      <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border ${
        isUser ? 'bg-arena-purple/10 border-arena-purple/30 text-arena-purple2' : 'bg-arena-teal/10 border-arena-teal/30 text-arena-teal'
      }`}>
        {isUser ? <Icons.Profile size={14} /> : <Icons.Shield size={14} />}
      </div>
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
        <div className={`px-5 py-3.5 rounded-2xl ${
          isUser
            ? 'bg-arena-purple/5 border border-white/5 rounded-tr-sm'
            : 'bg-[#0A0A0A] border border-white/5 rounded-tl-sm'
        }`}>
          <MsgContent content={msg.content} />
        </div>
        <span className="font-mono text-[9px] text-white/20 px-2 uppercase tracking-tighter">
          {msg.timestamp ? format(new Date(msg.timestamp), 'HH:mm') : ''}
        </span>
      </div>
    </div>
  );
}

export default function MentorPage() {
  const [sessions, setSessions]       = useState([]);
  const [activeSession, setActive]    = useState(null);
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [code, setCode]               = useState('');
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
  }, [messages, sending]);

  const newSession = async () => {
    const r = await api.post('/mentor/sessions', { topic: 'Consultation ' + (sessions.length + 1) });
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

  const send = useCallback(async (msgText, attachedCode) => {
    const text = (msgText || input).trim();
    const finalCode = attachedCode ?? code;
    if (!text && !finalCode) return;

    let sessionId = activeSession?.id;
    if (!sessionId) {
      const r = await api.post('/mentor/sessions', { topic: text.slice(0, 30) || 'Architectural Review' });
      setSessions(s => [r.data.session, ...s]);
      setActive(r.data.session);
      sessionId = r.data.session.id;
    }

    const userMsg = { role: 'user', content: finalCode ? `${text}\n\n\`\`\`\n${finalCode}\n\`\`\`` : text, timestamp: new Date().toISOString() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    if (!attachedCode) setCode('');
    setSending(true);

    try {
      const r = await api.post(`/mentor/sessions/${sessionId}/message`, { message: text, code: finalCode || undefined });
      const aiMsg = { role: 'assistant', content: r.data.response, timestamp: new Date().toISOString() };
      setMessages(m => [...m, aiMsg]);
      setSessions(s => s.map(x => x.id === sessionId ? { ...x, messages: [...(Array.isArray(x.messages) ? x.messages : []), userMsg, aiMsg] } : x));
    } catch (_) { toast.error('Signal Loss: Mentor unreachable'); }
    setSending(false);
  }, [input, code, activeSession]);

  if (loading) return (
    <div className="flex items-center justify-center py-32"><Spinner size={24} className="text-arena-purple2" /></div>
  );

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)] min-h-[600px]">
      {/* LEFT: Chat Section */}
      <div className="flex-1 flex flex-col bg-[#0A0A0F] border border-white/5 rounded-2xl overflow-hidden relative shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-arena-purple/10 border border-arena-purple/20 flex items-center justify-center">
              <Icons.Shield size={18} className="text-arena-purple" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white tracking-tight">Lead Architect</p>
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-arena-teal animate-pulse" /> Strategic Oversight
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <Button onClick={newSession} variant="ghost" size="sm" className="h-8 border-white/5 hover:bg-white/5">
                <Icons.Plus size={14} className="text-white/40" />
             </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
               <div className="grid grid-cols-2 gap-4 max-w-md">
                 {POWER_UPS.map(up => (
                   <button
                     key={up.id}
                     onClick={() => { setCode('// Paste relevant code into the Context Desk on the right'); setInput(up.prompt); }}
                     className="p-4 rounded-xl border border-white/5 bg-[#0D0D12] hover:border-arena-purple/40 hover:bg-arena-purple/5 transition-all text-left group"
                   >
                     <up.icon size={16} className="text-white/30 group-hover:text-arena-purple mb-3 transition-colors" />
                     <p className="font-display font-semibold text-xs text-white/80 group-hover:text-white">{up.label}</p>
                     <p className="font-mono text-[9px] text-white/30 mt-1 uppercase tracking-tighter">Tactical Power-up</p>
                   </button>
                 ))}
               </div>
            </div>
          )}
          {messages.map((msg, i) => <Message key={i} msg={msg} />)}
          {sending && (
            <div className="flex gap-4 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-arena-teal/10 border border-arena-teal/30 flex items-center justify-center text-arena-teal">
                <Icons.Shield size={14} />
              </div>
              <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-[#0A0A0A] border border-white/5">
                <div className="flex items-center gap-1.5">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1 h-1 rounded-full bg-arena-teal animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="px-6 pb-6 pt-2 bg-gradient-to-t from-black/80 to-transparent">
          <div className="relative flex items-end gap-3 bg-[#111] border border-white/10 p-3 rounded-2xl shadow-xl">
             <textarea
               className="flex-1 bg-transparent border-none text-sm text-white/80 placeholder:text-white/20 resize-none py-2 px-1 focus:ring-0 scrollbar-hide"
               rows={1}
               style={{ minHeight: 40, maxHeight: 180 }}
               value={input}
               onChange={e => setInput(e.target.value)}
               placeholder="Consult with the Architect..."
               onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }}}
               onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px'; }}
             />
             <Button 
                onClick={() => send()} 
                variant="purple" 
                size="sm" 
                className="h-10 w-10 p-0 rounded-xl"
                loading={sending} 
                disabled={!input.trim() && !code}
             >
                <Icons.ArrowRight size={16} />
             </Button>
          </div>
        </div>
      </div>

      {/* RIGHT: Context Intelligence Desk */}
      <div className="w-[380px] flex flex-col gap-4 invisible md:visible">
         <div className="flex-1 bg-[#0A0A0F] border border-white/5 rounded-2xl flex flex-col p-5 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-5">
               <div className="flex items-center gap-2">
                 <Icons.Code size={14} className="text-arena-teal" />
                 <h2 className="font-display font-bold text-sm uppercase tracking-wider text-white">Context Desk</h2>
               </div>
               <BadgeTag variant="gray" className="text-[9px]">v4.0 Core</BadgeTag>
            </div>

            <div className="flex-1 flex flex-col min-h-0 bg-black/40 rounded-xl border border-white/5 p-4 overflow-hidden group focus-within:border-arena-teal/30 transition-colors">
               <div className="flex items-center justify-between mb-3">
                 <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Active Buffer</p>
                 <button onClick={() => setCode('')} className="text-white/20 hover:text-red-400 transition-colors">
                   <Icons.XIcon size={12} />
                 </button>
               </div>
               <textarea
                 className="flex-1 w-full bg-transparent border-none font-mono text-xs text-white/60 placeholder:text-white/10 resize-none focus:ring-0 scrollbar-hide"
                 value={code}
                 onChange={e => setCode(e.target.value)}
                 placeholder="// Operational Context (Code, Logs, JSON)..."
                 spellCheck={false}
               />
               <div className="flex justify-end pt-3 border-t border-white/5 mt-3">
                  <span className="font-mono text-[9px] text-white/20">{code.length} characters matched</span>
               </div>
            </div>

            <div className="mt-5 space-y-2">
               <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest px-1">Tactical Actions</p>
               <div className="grid grid-cols-1 gap-2">
                  {POWER_UPS.map(up => (
                    <button
                      key={up.id}
                      onClick={() => send(up.prompt)}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group"
                      disabled={!code.trim() && !sending}
                    >
                      <div className="flex items-center gap-3">
                        <up.icon size={12} className="text-arena-teal group-hover:scale-110 transition-transform" />
                        <span className="font-body text-xs text-white/70 group-hover:text-white">{up.label}</span>
                      </div>
                      <Icons.ChevronRight size={12} className="text-white/10 group-hover:text-white/40" />
                    </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="bg-[#0A0A0F] border border-white/5 rounded-2xl p-4">
            <h3 className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">Recent Sessions</h3>
            <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-hide">
               {sessions.map(s => (
                 <button
                   key={s.id}
                   onClick={() => selectSession(s)}
                   className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${
                     activeSession?.id === s.id ? 'bg-arena-purple/10 border border-arena-purple/20' : 'hover:bg-white/5'
                   }`}
                 >
                   <div className="flex items-center gap-2.5 min-w-0">
                     <Icons.Shield size={10} className={activeSession?.id === s.id ? 'text-arena-purple' : 'text-white/20'} />
                     <span className={`font-mono text-[11px] truncate ${activeSession?.id === s.id ? 'text-white' : 'text-white/40'}`}>
                        {s.topic}
                     </span>
                   </div>
                   <button onClick={(e) => deleteSession(s.id, e)} className="text-white/10 hover:text-red-400 p-1">
                      <Icons.XIcon size={10} />
                   </button>
                 </button>
               ))}
               {sessions.length === 0 && <p className="text-center py-4 font-mono text-[9px] text-white/20">Empty Matrix</p>}
            </div>
         </div>
      </div>
    </div>
  );
}

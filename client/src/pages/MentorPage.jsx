import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { Avatar } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MentorPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Welcome message
    setMessages([
      { role: 'assistant', content: "Hello! I'm your AI Mentor. I can help you debug code, explain complex concepts, or guide you through system design. What are you working on today?" }
    ]);
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
      const res = await api.post('/mentor/chat', { message: input, context: 'general' });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again later." }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col font-sans animate-fade-in pt-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="font-display font-black text-3xl text-slate-900 mb-1 tracking-tight">AI Mentor</h1>
          <p className="text-sm text-slate-500 font-medium">Your personal pair-programming assistant.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Online</span>
        </div>
      </div>

      {/* Chat Box */}
      <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
        
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 z-10">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className="shrink-0">
                {m.role === 'assistant' ? (
                  <div className="w-10 h-10 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center">
                    <Icons.Zap size={20} className="text-white" />
                  </div>
                ) : (
                  <Avatar user={user} size={40} className="border border-slate-200 shadow-sm" />
                )}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-slate-50 border border-slate-200 text-slate-800'
              }`}>
                {m.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                ) : (
                  <ReactMarkdown
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <div className="my-3 rounded-lg overflow-hidden border border-slate-200">
                            <SyntaxHighlighter style={oneLight} language={match[1]} PreTag="div" {...props}>
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code className="bg-slate-200/50 text-blue-700 px-1.5 py-0.5 rounded font-mono text-[13px]" {...props}>
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
             <div className="flex gap-4 max-w-[85%]">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Icons.Zap size={20} className="text-white" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{animationDelay: '0.2s'}} />
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{animationDelay: '0.4s'}} />
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-slate-100 bg-white z-10">
          <div className="relative flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                   e.preventDefault();
                   handleSend();
                }
              }}
              placeholder="Ask me anything..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-5 pr-14 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all resize-none overflow-hidden"
              rows={1}
              style={{ minHeight: '56px', maxHeight: '150px' }}
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-3 w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm"
            >
              <Icons.ArrowRight size={18} />
            </button>
          </div>
          <p className="text-center text-[11px] font-bold text-slate-400 mt-3 uppercase tracking-widest">
            AI responses may contain inaccuracies. Verify critical code.
          </p>
        </div>
      </div>
    </div>
  );
}

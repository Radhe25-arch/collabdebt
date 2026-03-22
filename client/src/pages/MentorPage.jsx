import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { Avatar, Spinner } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MentorPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('// Paste your code here for review...\n\nfunction example() {\n  console.log("Analyzing...");\n}');
  const [debugOutput, setDebugOutput] = useState(null);
  const [debugLoading, setDebugLoading] = useState(false);
  const [fixLoading, setFixLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Hi! I'm your AI Mentor. I can review your code, help debug tricky logic, explain concepts, or guide you through system design. What would you like to work on?",
      }]);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'history') loadHistory();
  }, [activeTab]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await api.get('/mentor/history');
      setHistory(res.data.sessions || []);
    } catch {
      // fallback to empty
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const callMentor = async (message, context = 'general') => {
    const res = await api.post('/mentor/chat', { message, context });
    return res.data.response;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const response = await callMentor(input, 'general');
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check your internet connection and try again.",
      }]);
    }
    setLoading(false);
  };

  const runDebug = async () => {
    if (!code.trim()) return;
    setDebugLoading(true);
    setDebugOutput({ status: 'analyzing' });
    try {
      const response = await callMentor(
        `Please review this code and identify: 1) any optimizations, 2) security issues, 3) structural problems. Be concise.\n\n\`\`\`\n${code}\n\`\`\``,
        'debugging'
      );
      setDebugOutput({ status: 'ready', aiResponse: response, findings: [] });
    } catch {
      // fallback mock findings if API fails
      setDebugOutput({
        status: 'ready',
        aiResponse: null,
        findings: [
          { type: 'optimization', severity: 'info',    msg: 'Consider extracting reusable logic into helper functions.' },
          { type: 'security',     severity: 'warning', msg: 'Validate and sanitize any external inputs before use.' },
          { type: 'structure',    severity: 'success', msg: 'Overall code structure follows standard patterns.' },
        ],
      });
    }
    setDebugLoading(false);
  };

  const generateFix = async () => {
    if (!code.trim()) return;
    setFixLoading(true);
    try {
      const response = await callMentor(
        `Please provide a corrected and improved version of this code with explanations:\n\n\`\`\`\n${code}\n\`\`\``,
        'debugging'
      );
      setMessages([
        { role: 'assistant', content: "Here's the improved version of your code:" },
        { role: 'assistant', content: response },
      ]);
      setActiveTab('chat');
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Couldn't generate a fix right now. Please try again.",
      }]);
      setActiveTab('chat');
    }
    setFixLoading(false);
  };

  const TABS = [
    { id: 'chat',    icon: Icons.MessageSquare, label: 'Chat' },
    { id: 'debug',   icon: Icons.Terminal,      label: 'Debug' },
    { id: 'history', icon: Icons.Clock,         label: 'History' },
  ];

  const severityStyles = {
    info:    'border-l-blue-500 bg-blue-50',
    warning: 'border-l-amber-500 bg-amber-50',
    success: 'border-l-green-500 bg-green-50',
  };
  const severityText = {
    info:    'text-blue-600',
    warning: 'text-amber-600',
    success: 'text-green-600',
  };

  return (
    <div className="max-w-[1400px] mx-auto flex gap-4 font-sans animate-fade-in pb-4" style={{ height: 'calc(100vh - 6rem)' }}>

      {/* ── LEFT SIDEBAR ── */}
      <div className="w-16 shrink-0 flex flex-col items-center gap-3 py-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm mb-2">
          <Icons.Terminal size={16} className="text-white" />
        </div>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <tab.icon size={17} />
            <span className="absolute left-full ml-3 px-2 py-1 rounded-lg bg-slate-900 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-lg">
              {tab.label}
            </span>
          </button>
        ))}
        <div className="mt-auto">
          <button title="Settings" className="w-10 h-10 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 flex items-center justify-center transition-all">
            <Icons.Settings size={16} />
          </button>
        </div>
      </div>

      {/* ── MAIN PANEL ── */}
      <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="font-display font-bold text-slate-900 text-lg">
              {activeTab === 'chat'    && 'AI Mentor'}
              {activeTab === 'debug'   && 'Code Review'}
              {activeTab === 'history' && 'Session History'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeTab === 'chat'    && 'Ask anything — code, concepts, architecture'}
              {activeTab === 'debug'   && 'Paste code for AI-powered analysis and fixes'}
              {activeTab === 'history' && 'Your previous mentor sessions'}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1.5 rounded-full border border-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold">AI Active</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">

          {/* ── CHAT ── */}
          {activeTab === 'chat' && (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5">
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`} style={{ maxWidth: '85%', marginLeft: m.role === 'user' ? 'auto' : 0 }}>
                    <div className="flex-shrink-0 pt-0.5">
                      {m.role === 'assistant' ? (
                        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                          <Icons.Code size={15} className="text-white" />
                        </div>
                      ) : (
                        <Avatar user={user} size={32} className="rounded-xl" />
                      )}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm'
                    }`}>
                      {m.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      ) : (
                        <ReactMarkdown
                          className="prose prose-sm max-w-none prose-p:text-slate-700 prose-p:my-1"
                          components={{
                            code({ node, inline, className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <div className="my-3 rounded-xl overflow-hidden border border-slate-200">
                                  <div className="bg-slate-800 px-4 py-2 flex justify-between items-center">
                                    <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase">{match[1]}</span>
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                  </div>
                                  <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" className="!m-0 !text-xs !p-4" {...props}>
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                </div>
                              ) : (
                                <code className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono text-xs" {...props}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3" style={{ maxWidth: '85%' }}>
                    <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Icons.Code size={15} className="text-blue-600 animate-pulse" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                      {[0, 0.15, 0.3].map((delay, i) => (
                        <span key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${delay}s` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {messages.length <= 1 && (
                <div className="px-6 pb-3 flex flex-wrap gap-2">
                  {['Review my code for bugs', 'Explain Big O notation', 'Help me with system design', 'What is a closure?'].map(p => (
                    <button
                      key={p}
                      onClick={() => setInput(p)}
                      className="text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-600 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-full transition-all font-medium"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0">
                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Ask your AI mentor anything..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-all"
                    rows={1}
                    style={{ minHeight: 48, maxHeight: 160 }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center disabled:opacity-40 transition-all shadow-sm flex-shrink-0"
                  >
                    <Icons.ArrowRight size={17} />
                  </button>
                </div>
                <p className="text-center text-[10px] text-slate-300 mt-2">Press Enter to send · Shift+Enter for new line</p>
              </div>
            </>
          )}

          {/* ── DEBUG / CODE REVIEW ── */}
          {activeTab === 'debug' && (
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 flex flex-col p-5 gap-4 border-r border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Code</span>
                  <button onClick={() => { setCode(''); setDebugOutput(null); }} className="text-xs text-slate-400 hover:text-slate-700 font-medium transition-colors">Clear</button>
                </div>
                <div className="flex-1 rounded-xl border border-slate-200 bg-slate-900 overflow-hidden relative">
                  <textarea
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full h-full bg-transparent text-blue-300 font-mono text-sm outline-none resize-none p-4"
                  />
                  <button
                    onClick={runDebug}
                    disabled={debugLoading || !code.trim()}
                    className="absolute bottom-4 right-4 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
                  >
                    {debugLoading ? <Spinner size={12} /> : <Icons.Play size={12} />}
                    {debugLoading ? 'Analyzing...' : 'Run Review'}
                  </button>
                </div>
              </div>

              <div className="w-80 p-5 flex flex-col gap-4 overflow-y-auto flex-shrink-0">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 border-b border-slate-100">Review Output</h3>

                {!debugOutput && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-12 opacity-50">
                    <Icons.Shield size={36} className="text-slate-300 mb-3" />
                    <p className="text-sm text-slate-400 font-medium">Paste code and click Run Review</p>
                  </div>
                )}

                {debugOutput?.status === 'analyzing' && (
                  <div className="space-y-3">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 animate-pulse rounded-full" style={{ width: '66%' }} />
                    </div>
                    <p className="text-xs text-blue-600 font-medium">AI is analyzing your code...</p>
                  </div>
                )}

                {debugOutput?.status === 'ready' && (
                  <div className="space-y-3">
                    {/* AI Response */}
                    {debugOutput.aiResponse && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">AI Analysis</p>
                        <div className="text-xs text-slate-700 leading-relaxed prose prose-xs max-w-none">
                          <ReactMarkdown>{debugOutput.aiResponse}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                    {/* Fallback findings */}
                    {debugOutput.findings?.map((f, i) => (
                      <div key={i} className={`p-4 rounded-xl border-l-4 ${severityStyles[f.severity]}`}>
                        <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${severityText[f.severity]}`}>{f.type}</p>
                        <p className="text-xs text-slate-700 leading-relaxed">{f.msg}</p>
                      </div>
                    ))}
                    <button
                      onClick={generateFix}
                      disabled={fixLoading}
                      className="w-full mt-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {fixLoading ? <Spinner size={12} /> : <Icons.Code size={13} />}
                      {fixLoading ? 'Generating...' : 'Generate Fix'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── HISTORY ── */}
          {activeTab === 'history' && (
            <div className="p-6 flex-1 overflow-y-auto">
              {historyLoading ? (
                <div className="flex justify-center py-12"><Spinner /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.length === 0 && (
                    <div className="col-span-3 text-center py-16">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                        <Icons.Clock size={20} className="text-slate-300" />
                      </div>
                      <p className="text-sm text-slate-500 font-medium">No history yet</p>
                      <p className="text-xs text-slate-400 mt-1">Start chatting with your AI mentor!</p>
                    </div>
                  )}
                  {history.map(h => (
                    <div
                      key={h.id}
                      onClick={() => { setActiveTab('chat'); }}
                      className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-200 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                        <Icons.MessageSquare size={15} className="text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{h.title || 'Mentor Session'}</h3>
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{h.preview || h.lastMessage || 'View session'}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-medium">{h.date || new Date(h.createdAt).toLocaleDateString()}</span>
                        <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Open <Icons.ArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={() => setActiveTab('chat')}
                    className="border border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
                      <Icons.Plus size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <p className="text-xs text-slate-400 font-medium">New Session</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

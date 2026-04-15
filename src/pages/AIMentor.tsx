import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send, Bot, User, Sparkles, Code2, 
  Lightbulb, BookOpen, Terminal, Copy, Check,
  Brain, Zap, ChevronRight
} from 'lucide-react';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

const STARTER_QUESTIONS = [
  { icon: Code2, text: 'Explain Rust\'s borrow checker' },
  { icon: Lightbulb, text: 'Difference between Arc and Rc?' },
  { icon: BookOpen, text: 'How does Go handles concurrency?' },
  { icon: Terminal, text: 'Optimize a distributed lock logic' },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: '0',
    role: 'assistant',
    content: `Hello, developer. I'm your Socratic AI mentor.\n\nI'm here to help you master the deep mechanics of software engineering. I won't just give you snippets — I'll guide you through the reasoning process.\n\nWhat are we building today?`,
    timestamp: new Date(),
  }
];

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-zinc-800 bg-black/40 group">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-zinc-800">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Source Code</span>
        <button onClick={copy} className="text-zinc-500 hover:text-white transition-colors">
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="p-4 bg-transparent text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">{code}</pre>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  const parts = msg.content.split(/(```[\s\S]*?```)/g);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg ${
        isUser ? 'bg-zinc-800 border border-zinc-700' : 'bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/30'
      }`}>
        {isUser ? <User size={16} className="text-zinc-300" /> : <Bot size={18} className="text-white" />}
      </div>
      <div className={`flex flex-col gap-1.5 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-indigo-600 text-white rounded-tr-sm'
            : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-sm'
        }`}>
          {parts.map((part, i) => {
            if (part.startsWith('```') && part.endsWith('```')) {
              const code = part.replace(/```\w*\n?/, '').replace(/```$/, '');
              return <CodeBlock key={i} code={code} />;
            }
            return (
              <span key={i}>
                {part.split(/\*\*(.*?)\*\*/g).map((p, j) =>
                  j % 2 === 1 ? <strong key={j} className="text-white font-bold">{p}</strong> : p
                )}
              </span>
            );
          })}
        </div>
        <span className="text-[10px] text-zinc-600 font-mono tracking-tighter uppercase px-1">
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}

export function AIMentor() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate AI thinking and Socratic response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getSocraticResponse(text),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 1500);
  };

  const getSocraticResponse = (q: string): string => {
    const query = q.toLowerCase();
    if (query.includes('borrow') || query.includes('rust')) {
      return `Rust's borrow checker is a marvel of static analysis. To help you grasp it deeper, consider this:\n\nIf multiple parts of your code could modify the same piece of data at once, what kind of **undefined behavior** would you expect to see? How does the "single mutable reference" rule solve this at compile time?`;
    }
    if (query.includes('arc') || query.includes('rc')) {
      return `Ah, shared ownership. You've noticed that \`Rc<T>\` isn't thread-safe, while \`Arc<T>\` is.\n\nWhat do you think is the **performance trade-off** between the two? Why wouldn't we just use \`Arc\` for everything?`;
    }
    if (query.includes('concurrency') || query.includes('go')) {
      return `Go's philosophy is "Do not share memory; communicate."\n\nWhen we use **Channels**, we're transferring ownership of data. Contrast this with **Mutexes**. In what scenario would a channel make your code cleaner than a lock?`;
    }
    return `That's a pivotal question. Let's dig into the mental model first.\n\nBased on what you've studied so far, how do you expect the system to behave under heavy load? What's your current **hypothesis** for the bottleneck?`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] -mt-4 max-w-5xl mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg border border-indigo-400/20">
            <Brain size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">Expert AI Mentor</h1>
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Socratic Analysis Engine
            </div>
          </div>
        </div>
        <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/5 font-mono text-[10px] tracking-widest py-1 px-3">
          GEMINI PRO • EXPERT
        </Badge>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto bg-zinc-950/50 rounded-3xl border border-zinc-900 p-8 space-y-8 scrollbar-hide">
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 border border-indigo-400/20">
              <Bot size={18} className="text-white" />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-none px-5 py-3.5">
              <div className="flex items-center gap-2">
                {[0, 150, 300].map(delay => (
                  <motion.div
                    key={delay}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1, delay: delay / 1000 }}
                    className="w-1.5 h-1.5 rounded-full bg-indigo-500"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Footer Interface */}
      <div className="mt-4 space-y-4">
        {messages.length <= 1 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {STARTER_QUESTIONS.map((q, i) => {
              const Icon = q.icon;
              return (
                <button
                  key={i}
                  onClick={() => sendMessage(q.text)}
                  className="group flex flex-col gap-2 p-4 rounded-2xl border border-zinc-900 bg-zinc-900/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left"
                >
                  <Icon size={16} className="text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                  <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">{q.text}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex gap-3 relative pb-2">
          <div className="flex-1 relative">
            <textarea
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask a deep technical question..."
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 text-white placeholder:text-zinc-600 px-5 py-4 rounded-2xl text-sm resize-none whitespace-pre-wrap outline-none"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-700 hidden sm:block">Press ↵ to send</span>
              <Button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="h-10 w-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex-shrink-0 shadow-lg"
                size="icon"
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

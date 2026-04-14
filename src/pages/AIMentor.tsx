import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Sparkles, Code2, Lightbulb, BookOpen, Terminal, Copy, Check } from 'lucide-react';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

const STARTER_QUESTIONS = [
  { icon: Code2, text: 'Explain Rust\'s borrow checker to me' },
  { icon: Lightbulb, text: 'What\'s the difference between Arc and Rc?' },
  { icon: BookOpen, text: 'How does async/await work in Go?' },
  { icon: Terminal, text: 'Debug my thread pool implementation' },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: '0',
    role: 'assistant',
    content: `Hello, developer. I'm your Socratic AI mentor.\n\nI won't just give you answers — I'll help you **discover** them through guided questioning. This deeper engagement creates durable understanding.\n\nWhat are you working on today?`,
    timestamp: new Date(),
  }
];

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-zinc-700">
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-800 border-b border-zinc-700">
        <span className="text-xs font-mono text-zinc-500">code</span>
        <button onClick={copy} className="text-zinc-500 hover:text-white transition-colors">
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        </button>
      </div>
      <pre className="p-3 bg-black/50 text-xs font-mono text-zinc-300 overflow-x-auto leading-5">{code}</pre>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  const parts = msg.content.split(/(```[\s\S]*?```)/g);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-indigo-600' : 'bg-gradient-to-tr from-purple-600 to-blue-600'
      }`}>
        {isUser ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
      </div>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-600 text-white rounded-tr-none'
            : 'bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-tl-none'
        }`}>
          {parts.map((part, i) => {
            if (part.startsWith('```') && part.endsWith('```')) {
              const code = part.replace(/```\w*\n?/, '').replace(/```$/, '');
              return <CodeBlock key={i} code={code} />;
            }
            return (
              <span key={i}>
                {part.split(/\*\*(.*?)\*\*/g).map((p, j) =>
                  j % 2 === 1
                    ? <strong key={j} className="text-white font-semibold">{p}</strong>
                    : p
                )}
              </span>
            );
          })}
        </div>
        <span className="text-xs text-zinc-600 px-1">
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

    try {
      const res = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || getMockReply(text),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getMockReply(text),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    }
    setLoading(false);
  };

  const getMockReply = (q: string): string => {
    if (q.toLowerCase().includes('borrow') || q.toLowerCase().includes('rust')) {
      return `Great question. Before I explain it, let me ask you something first:\n\nWhat problem do you think Rust is trying to solve with the borrow checker? What kinds of bugs does it prevent?\n\n*Take a moment to think about this — your answer will shape how we dig in.*`;
    }
    if (q.toLowerCase().includes('arc') || q.toLowerCase().includes('rc')) {
      return `Interesting. Let me probe your understanding first.\n\nYou know both \`Rc<T>\` and \`Arc<T>\` provide shared ownership. What do you think happens when two threads try to clone an \`Rc<T>\` simultaneously?\n\nHint: think about what "atomic" in Arc means.`;
    }
    return `That's a thoughtful question. Let me respond with a question of my own:\n\nWhat have you already tried? What's your current mental model of how this works?\n\nUnderstanding your starting point helps me guide you to the insight — rather than just handing it to you.`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] -mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.3)]">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white">AI Mentor</h1>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Socratic mode — online
            </div>
          </div>
        </div>
        <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/5 font-mono text-xs">
          Gemini Pro
        </Badge>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto bg-zinc-900/30 rounded-2xl border border-zinc-800 p-6 space-y-6">
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Starter prompts */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          {STARTER_QUESTIONS.map((q, i) => {
            const Icon = q.icon;
            return (
              <button
                key={i}
                onClick={() => sendMessage(q.text)}
                className="flex items-center gap-2 p-3 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-600 hover:bg-zinc-800 transition-colors text-left text-sm text-zinc-400 hover:text-white"
              >
                <Icon size={14} className="text-zinc-500 flex-shrink-0" />
                {q.text}
              </button>
            );
          })}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3 mt-3">
        <div className="flex-1 relative">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="Ask anything... the mentor will guide, not give away."
            className="h-12 bg-zinc-900 border-zinc-700 focus-visible:border-indigo-500 text-white placeholder:text-zinc-600 pr-4 rounded-xl"
          />
        </div>
        <Button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="h-12 w-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex-shrink-0"
          size="icon"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}

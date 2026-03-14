'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Sparkles, Cpu, Zap, Terminal } from 'lucide-react'

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Neural link established. I've analyzed your fleet's current debt load. How can I assist with resolution strategy?" }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "Processing request... Analysis suggests prioritizing the 'Deprecated JWT Handler' in core-api. This will reduce architectural friction by 14%." 
      }])
    }, 1000)
  }

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-indigo-500 text-white shadow-[0_20px_40px_-10px_rgba(99,102,241,0.5)] flex items-center justify-center z-50 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <MessageSquare size={24} />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 100, scale: 0.8, filter: 'blur(10px)' }}
            className="fixed bottom-28 right-8 w-[380px] h-[550px] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-indigo-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">NEURAL ANALYST</h3>
                  <div className="flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[9px] font-black text-emerald-500 uppercase">System Optimal</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl text-xs font-medium leading-relaxed ${
                    msg.role === 'ai' 
                      ? 'bg-zinc-900 text-zinc-300 border border-white/5 rounded-tl-none' 
                      : 'bg-indigo-500 text-white rounded-tr-none shadow-lg'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/5 bg-black/40">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask about architectural health..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-3 pl-4 pr-12 text-white text-xs font-medium outline-none focus:border-indigo-500/50 transition-all"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-4 justify-center">
                 <div className="flex items-center gap-1 text-[9px] font-black text-zinc-600 uppercase">
                    <Terminal size={10} />
                    CMD+K
                 </div>
                 <div className="flex items-center gap-1 text-[9px] font-black text-zinc-600 uppercase">
                    <Cpu size={10} />
                    Neural Engine v4
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

'use client'

import { useState, useEffect, use } from 'react'
import dynamic from 'next/dynamic'
import { Crown, Users, X, Send, Sparkles, Link2, Copy, Check, LogOut, Loader2 } from 'lucide-react'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false, loading: () => (
  <div className="flex-1 flex items-center justify-center" style={{ background: '#020c12' }}>
    <Loader2 size={24} className="animate-spin" style={{ color: 'var(--text-dim)' }} />
  </div>
) })

const CURSOR_COLORS = ['#00e5ff', '#00ff88', '#7c3aed', '#ffd600', '#ff9600']

const MOCK_PARTICIPANTS = [
  { id: 'user-1', name: 'Arjun Kumar', color: '#00e5ff', isHost: true, isYou: true },
  { id: 'user-2', name: 'Priya Sharma', color: '#00ff88', isHost: false, isYou: false },
  { id: 'user-4', name: 'Sneha Patel', color: '#7c3aed', isHost: false, isYou: false },
]

const MOCK_MESSAGES = [
  { id: 1, sender: 'Priya Sharma', text: "I can see the race condition now — it's in the sleep hack", time: '2m ago', color: '#00ff88' },
  { id: 2, sender: 'Arjun Kumar', text: 'Yeah, we need a distributed lock. Redis would work here', time: '1m ago', color: '#00e5ff' },
  { id: 3, sender: 'Sneha Patel', text: 'Should we also handle the expired refresh token case?', time: '45s ago', color: '#7c3aed' },
]

const SAMPLE_COLLAB_CODE = `// Collaborative session: src/auth/token.service.ts
// 3 collaborators active

import { db } from '../db'
import { redisClient } from '../redis'
import { generateNewToken, isExpired } from './generate'

async function refreshToken(userId: string) {
  // TODO: handle race condition when multiple tabs
  // refresh simultaneously
  const token = await db.tokens.findOne({ userId })
  
  if (!token) return null
  
  // Working on fix below ↓
  await sleep(100) // HACK: remove this
  
  return generateNewToken(token)
}

export { refreshToken }
`

export default function CollabPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [aiQuery, setAiQuery] = useState('')
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [panelOpen, setPanelOpen] = useState<'chat' | 'ai' | null>('chat')
  const sessionUrl = `https://collabdebt.com/dashboard/collab/${token}`

  const copyLink = () => {
    navigator.clipboard.writeText(sessionUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendMessage = () => {
    if (!message.trim()) return
    setMessages(m => [...m, { id: Date.now(), sender: 'Arjun Kumar', text: message, time: 'just now', color: '#00e5ff' }])
    setMessage('')
  }

  const askAI = () => {
    if (!aiQuery.trim()) return
    setAiLoading(true)
    setTimeout(() => {
      setAiResponse('Based on the current file, the highest-priority fix is the race condition in `refreshToken`. Use a Redis distributed lock with a 5-second TTL. This will prevent multiple tabs from simultaneously refreshing the same token. Estimated fix: 2 hours, saves $4,200/month.')
      setAiLoading(false)
    }, 1500)
  }

  return (
    <div className="flex h-[calc(100vh-56px)] -m-6 overflow-hidden">
      {/* Participants panel */}
      <div className="w-52 shrink-0 border-r flex flex-col" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="px-3 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="dot-online animate-pulse-dot" />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>LIVE SESSION</span>
          </div>
          <p className="font-mono text-[10px]" style={{ color: 'var(--text-dim)' }}>{token}</p>
        </div>

        {/* Share link */}
        <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <button onClick={copyLink}
            className="w-full flex items-center gap-2 text-xs px-2.5 py-2 rounded-lg transition-all"
            style={{ background: 'rgba(0,229,255,0.08)', color: 'var(--cyan)', border: '1px solid rgba(0,229,255,0.15)' }}>
            {copied ? <><Check size={12} /> Copied!</> : <><Link2 size={12} /> Copy invite link</>}
          </button>
        </div>

        {/* Participants */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest font-semibold px-1 mb-1" style={{ color: 'var(--text-dim)' }}>
            Participants ({MOCK_PARTICIPANTS.length})
          </p>
          {MOCK_PARTICIPANTS.map(p => (
            <div key={p.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg"
              style={p.isYou ? { background: 'rgba(0,229,255,0.06)' } : {}}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}40` }}>
                {p.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium truncate">{p.isYou ? 'You' : p.name.split(' ')[0]}</span>
                  {p.isHost && <Crown size={10} style={{ color: '#ffd600', flexShrink: 0 }} />}
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: p.color }} />
                  <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>typing...</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leave / End */}
        <div className="p-3 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
          <button className="w-full flex items-center justify-center gap-2 text-xs py-2 rounded-lg transition-all hover:bg-white/5"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            <LogOut size={12} /> Leave session
          </button>
          <button className="w-full flex items-center justify-center gap-2 text-xs py-2 rounded-lg transition-all"
            style={{ color: 'var(--red)', border: '1px solid rgba(255,59,92,0.2)', background: 'rgba(255,59,92,0.05)' }}>
            <X size={12} /> End session (host)
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor topbar */}
        <div className="h-10 border-b flex items-center px-4 gap-3 shrink-0"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--text)' }}>token.service.ts</span>
          </span>
          <div className="flex items-center gap-1 ml-2">
            {MOCK_PARTICIPANTS.map(p => (
              <div key={p.id} title={p.name}
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-[8px] font-bold -ml-1 first:ml-0"
                style={{ background: `${p.color}20`, borderColor: p.color, color: p.color }}>
                {p.name[0]}
              </div>
            ))}
            <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>3 editing</span>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={() => setPanelOpen(panelOpen === 'chat' ? null : 'chat')}
              className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg transition-all ${panelOpen === 'chat' ? '' : ''}`}
              style={panelOpen === 'chat' ? { background: 'rgba(0,229,255,0.1)', color: 'var(--cyan)' } : { color: 'var(--text-muted)' }}>
              Chat
            </button>
            <button onClick={() => setPanelOpen(panelOpen === 'ai' ? null : 'ai')}
              className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg transition-all"
              style={panelOpen === 'ai' ? { background: 'rgba(124,58,237,0.1)', color: '#7c3aed' } : { color: 'var(--text-muted)' }}>
              <Sparkles size={12} /> Debt AI
            </button>
          </div>
        </div>

        <MonacoEditor
          height="100%"
          defaultLanguage="typescript"
          defaultValue={SAMPLE_COLLAB_CODE}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            lineHeight: 22,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            padding: { top: 16 },
          }}
        />
      </div>

      {/* Right panel — chat or AI */}
      {panelOpen && (
        <div className="w-72 shrink-0 border-l flex flex-col" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          {panelOpen === 'chat' ? (
            <>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <span className="font-semibold text-sm">Session Chat</span>
                <button onClick={() => setPanelOpen(null)}><X size={14} style={{ color: 'var(--text-muted)' }} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                  <div key={msg.id}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold" style={{ color: msg.color }}>{msg.sender}</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{msg.time}</span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{msg.text}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex gap-2">
                  <input className="input flex-1 text-sm py-2"
                    placeholder="Type a message..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                  <button onClick={sendMessage} className="btn-primary p-2">
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} style={{ color: '#7c3aed' }} />
                  <span className="font-semibold text-sm">Debt AI</span>
                </div>
                <button onClick={() => setPanelOpen(null)}><X size={14} style={{ color: 'var(--text-muted)' }} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {aiResponse && (
                  <div className="p-3 rounded-xl text-sm mb-4" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', color: 'var(--text-muted)' }}>
                    {aiResponse}
                  </div>
                )}
                {!aiResponse && (
                  <p className="text-xs text-center py-8" style={{ color: 'var(--text-dim)' }}>
                    Ask the AI about debt in this file
                  </p>
                )}
              </div>
              <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex gap-2">
                  <input className="input flex-1 text-sm py-2"
                    placeholder="What should we fix first?"
                    value={aiQuery}
                    onChange={e => setAiQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && askAI()} />
                  <button onClick={askAI} disabled={aiLoading} className="btn-primary p-2">
                    {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
